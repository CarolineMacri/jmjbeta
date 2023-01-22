const catchAsync = require("../../utils/catchAsync");

exports.getRegistrationsTable = catchAsync(async (req, res, next) => {
  const Year = require("../../models/yearModel");
  const User = require("../../models/userModel");

  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const registrations = await User.find().sort({ lastName: 1 });
  console.log('-----------------------')
  res.status(200).render("registrations/registrations_table", {
    title: `Registrations ${selectedYear}`,
    registrations,
    years,
    selectedYear,
  });
});
