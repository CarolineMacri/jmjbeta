const catchAsync = require("../../utils/catchAsync");
exports.getCoursesTable = catchAsync(async (req, res, next) => {
  const Year = require("../../models/yearModel");
  const Course = require("../../models/courseModel");
  const User = require("../../models/userModel");
  const Teacher = require("../../models/teacherModel");

  let { selectedYear, ownerId } = req.params;
  
  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const hasOwner = ownerId != " " && typeof ownerId != "undefined";

  var courses = {};
  var owner = {};
  if (!hasOwner) {
    courses = await Course.find({ years: selectedYear }).sort({ name: 1 });
  } else {
    // get courses
    courses = await Course.find({
      years: selectedYear,
      owner: ownerId,
    }).populate({
      path: "owner",
      justOne: true,
    });
    // get owner
    owner = await User.findOne({ _id: ownerId });
    //console.log(owner);
  }

  res.status(200).render("courses/course_table", {
    title: `Courses ${selectedYear}`,
    courses,
    years,
    selectedYear,
    owner,
    hasOwner,
  });
});

exports.getCourseProfile = catchAsync(async (req, res, next) => {
  const Year = require("../../models/yearModel");
  const Course = require("../../models/courseModel");
  const User = require("../../models/userModel");

  let { courseId, selectedYear, ownerId } = req.params;
  //console.log(courseId, selectedYear, ownerId);

  const hasOwner = typeof ownerId != "undefined";

  var course = {};

  if (courseId == "new") {
    course = new Course();
    course.years.push(selectedYear);
  } else {
    course = await Course.findOne({ _id: courseId });
  }

  const teachers = await User.find()
    .where(`yearRoles.${selectedYear}`)
    .equals("teacher")
    .sort("lastName");

  const years = await Year.find();

  res.status(200).render("courses/course_profile", {
    title: `${course.name}`,
    course,
    selectedYear,
    teachers,
    years,
    grades: Object.values(Course.Grades),
    hasOwner,
    ownerId,
  });
});
