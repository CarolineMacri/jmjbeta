const randomize = require('randomatic')
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Year = require('../../models/yearModel');

exports.getLogin = catchAsync(async (req, res, next) => {
  const currentYear = await Year.getCurrentYearValue();
  const currentYearDoc = await Year.getCurrentYearDoc();
  res.locals.currentYear = currentYear;
  res.locals.currentYearDoc = currentYearDoc;
  res.status(200).render('login/login', {
    title: 'Login',
  });
});

exports.getResetPassword = catchAsync(async (req, res, next) => {
  const currentYear = await Year.getCurrentYearValue();
  const currentYearDoc = await Year.getCurrentYearDoc();
  res.locals.currentYear = currentYear;
  res.locals.currentYearDoc = currentYearDoc;
  res.status(200).render('login/resetPassword', {
    title: 'resetPassword',
  });
});

exports.updatePassword = catchAsync(async (req, res) => {
  res.status(200).render('login/updatePassword', {
    title: 'Update Password',
  });
});

exports.getHome = catchAsync(async (req, res, next) => {
  if (3 === 2) {
    res.status(308).redirect('login');
  } else {
    res.status(308).redirect('login');
  }
});
exports.getSplash = catchAsync(async (req, res, next) => {
  res.status(200).render('splash', {
    title: 'Home',
  });
});

exports.setAllUserPasswords = catchAsync(async (req, res, next) => {
  let { email } = req.params;
  var response = {};

  const randomPassword = randomize('Aa0!', 13);

  if (email) {
    response = await User.setOneUserPassword(email, randomPassword);
  } else {
    response = await User.setAllUserPasswords(randomPassword);
  }
  res.status(200).render('login/pw', {
    title: `Reset ${email ? email : 'EVERY'} password`,
    email,
  });
});
