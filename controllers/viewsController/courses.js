const catchAsync = require('../../utils/catchAsync');
exports.getCoursesTable = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const Course = require('../../models/courseModel');

  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const courses = await Course.find({ years: selectedYear }).sort({ name: 1 });

  res.status(200).render('courses/course_table', {
    title: `Courses ${selectedYear}`,
    courses,
    years,
    selectedYear,
  });
});

exports.getCourseProfile = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const Course = require('../../models/courseModel');
  const User = require('../../models/userModel');

  let { courseId, selectedYear } = req.params;

  var course = {};

  if (courseId == 'new') {
    course = new Course();
    course.years.push(selectedYear);
  } else {
    course = await Course.findOne({ _id: courseId });
  }

  const teachers = await User.find()
    .where(`yearRoles.${selectedYear}`)
    .equals('teacher')
    .sort('lastName');
 

  const years = await Year.find();
  
  res.status(200).render('courses/course_profile', {
    title: `${course.name}`,
    course,
    selectedYear,
    teachers,
    years
  });
});
