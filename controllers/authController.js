//NODE modules
const { promisify } = require('util');
const mongoose = require('mongoose');

//NPM modules
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const Email = require('../utils/email');


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cannot be accessed or modified by the browser
  };
  // cookie can only be sent on an https connection
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // because it will only work in https

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; //doesn't show up in response

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    userName,
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  } = req.body;

  const newUser = await User.create({
    userName,
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async function (req, res, next) {
  logger.log('in authcontroller login and mongoose connections = ' + JSON.stringify(mongoose.connections.length));
 
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide username and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); 
  }

  // temporary
  // const url = 'https://';
  // await new Email(user, url).sendWelcome();

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

// Only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token exists
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);

      // 2) Check if user still exists
      if (!currentUser) {
        return next();
      }

      // 3) check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGIN IN USER
      res.locals.user = currentUser; // pug has access to res.locals
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  let token = undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'null') {
    // return next(
    //   new AppError('You are not logged in! Please log in to get access', 401)
    // );

    res
      .status(308)
      .set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
      )
      .redirect('/login');
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token no longer exists', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User changed the password recentl!  Please log in again.',
        401
      )
    );
  }

  // check to see if user is registered for this school year
  var isCurrentlyRegistered = await currentUser.isCurrentlyRegistered();
  if(!isCurrentlyRegistered){
    return next(
      new AppError('User is not currently registered for this school year', 401)
    );
  }
  currentUser.currentlyRegistered = true;

  // get the users roles for this year
  var currentRoles = await currentUser.getCurrentRoles();  
  if (!currentRoles){
    return next(
      new AppError('User is has no roles set for this school year', 401)
    );
  }
  currentUser.currentRoles = currentRoles

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...restrictedRoles) => {
  return (req, res, next) => {
   
    const okRoles = req.user.currentRoles.filter((userRole) =>
      restrictedRoles.includes(userRole)
    );
    if (okRoles.length === 0) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log("/n/n/n ----------------------------------- /n" + req.body.email);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const newUser = await User.findOne({ email: req.body.email });
  console.log("/n/n/n ----------------------------------- /n" + newUser.email + "   " + newUser.passwordResetToken);
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;
  

  // Send it to the user's email
  try {
    await new Email(user, resetUrl).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    })
     
    
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 201, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Invalid passowrd', 401));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createSendToken(user, 200, req, res);
});
