const catchAsync = require('../../utils/catchAsync');

const Year = require('../../models/yearModel');
const User = require('../../models/userModel');

exports.getMyProfile = catchAsync(async (req, res) => {
  res.status(200).render('myProfile', {
    title: 'My Profile',
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const users = await User.find({ "registration.year": selectedYear }).sort(
    'lastName'
  );

  res.status(200).render('users', {
    title: 'users',
    users,
    years,
    selectedYear,
  });
});
