const User = require("../models/userModel");
const factory = require("./controllerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.createUser = factory.createOne(User);

exports.emailRegistrationVerification = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const userId = req.params.id
  const user = await User.findById(userId);
  console.log(user);
  await new Email(user, '', '').sendRegistrationVerification();
  return next(
    new AppError(
      `sending email to ${user.firstName} has not been implemented`,
      400
    )
  );
})

// update currently authenticated user to change name and email address
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create an error if the user POSTS password data with
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates.  Please use /updateMyPassword",
        400
      )
    );
  }

  // 2) filtered unwanted field names (this is just to update profile type data)
  //  obviously, can't update role, could change to 'admin'
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "cellPhone"
  );

  // 3) update the user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, // this was set in the auth controller protection routind
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
