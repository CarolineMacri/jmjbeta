const catchAsync = require("../../utils/catchAsync");

const Year = require("../../models/yearModel");
const User = require("../../models/userModel");

exports.getMyProfile = catchAsync(async (req, res) => {
  res.status(200).render("myProfile", {
    title: "My Profile",
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const fieldName = `yearRoles.${selectedYear}`;
  //console.log(fieldName);

  var users = await User.find().exists(fieldName, true).sort("lastName");
  users.forEach((user) => {
    user.roles = user.get(fieldName);
  });

  res.status(200).render("users", {
    title: `${selectedYear} Users`,
    users,
    years,
    selectedYear,
  });
});
