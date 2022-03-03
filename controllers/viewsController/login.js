const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');

exports.getLogin = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
      title: 'Login',
    });
  });
  
  exports.getResetPassword = catchAsync(async (req, res, next) => {
    res.status(200).render('resetPassword', {
      title: 'resetPassword',
    });
  });

  exports.updatePassword = catchAsync(async (req, res) => {
    res.status(200).render('updatePassword', {
      title: 'Update Password',
    });
  });
  
  exports.getHome = catchAsync(async (req, res, next) => {
    if (3 === 2) {
      res.status(308).redirect('/login');
    } else {
      res.status(308).redirect('/login');
    }
  });

  exports.setAllUserPasswords = catchAsync(async (req, res, next) => {
    const response = User.setAllUserPasswords('pass1234');
    res.status(200).render('pw', {
      title: 'SET ALL PASSWORD',
    });
  });