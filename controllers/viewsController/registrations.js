const catchAsync = require('../../utils/catchAsync');

exports.getRegistrationsTable = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const User = require('../../models/userModel');

  let { selectedYear } = req.params;

  const years = await Year.find();

  const registrations = await User.find().sort({ lastName: 1 });
  res.status(200).render('registrations/registrations_table', {
    title: `Registrations ${selectedYear}`,
    registrations,
    years,
    selectedYear,
  });
});

exports.getRegistrationProfile = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const User = require('../../models/userModel');

  let { selectedYear, registeredUserId } = req.params;
  console.log('get registration profile', selectedYear, registeredUserId);

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }
  let registeredUser = await User.findById(registeredUserId);

  const registeredYears = [...registeredUser.yearRoles.keys()].filter((key) => { return registeredUser.yearRoles.get(key) !== null; });
  registeredYears.forEach((key)=> {
    console.log('key -  ',registeredUser.yearRoles.get(key));
  });

  console.log(registeredYears);

  res.status(200).render('registrations/registration_profile', {
    title: `Registrations ${selectedYear}`,
    registeredUser,
    registeredYears,
    years,
    selectedYear,
  });
});
