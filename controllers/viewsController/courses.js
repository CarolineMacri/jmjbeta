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

  const courses = await Course
    .find({ year: selectedYear })
    .sort({ name: 1 })
    .populate({
      path: 'classes',
      match: {year: selectedYear}
    });

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

  let {courseId} = req.params;

  const course = await Course
    .findOne({ _id: courseId });
  
  console.log(course);
    

  res.status(200).render('courses/course_profile', {
    title: `${course.name}`,
    course,
   
  });
});

