const catchAsync = require("../../utils/catchAsync");
const User = require("../../models/userModel");

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render("login/login", {
    title: "Login",
  });
});

exports.getResetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("login/resetPassword", {
    title: "resetPassword",
  });
});

exports.updatePassword = catchAsync(async (req, res) => {
  res.status(200).render("login/updatePassword", {
    title: "Update Password",
  });
});

exports.getHome = catchAsync(async (req, res, next) => {
  if (3 === 2) {
    res.status(308).redirect("login");
  } else {
    res.status(308).redirect("login");
  }
});
exports.getSplash = catchAsync(async (req, res, next) => {
  res.status(200).render("splash", {
    title: "Home",
  })
});

exports.setAllUserPasswords = catchAsync(async (req, res, next) => {
  let { email } = req.params;
  var response = {};

  if (email) {
    response = User.setOneUserPassword(email,"pass1234");
  }
  else {
    response = User.setAllUserPasswords("pass1234");    
  }
  res.status(200).render("login/pw", {
    title: `Reset ${email ? email : "EVERY"} password`,
    email
  });
});

// exports.setUserPassword = catchAsync(async (req, res, next) => {
//   let { email } = req.params;
//   const response = User.setOneUserPassword(email,"pass1234");
//   res.status(200).render("login/pw", {
//     title: "SET One PASSWORD",
//   });
// });
