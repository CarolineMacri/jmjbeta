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

  const courses = await Course.find({ year: selectedYear })
    .sort({ name: 1 })
    .populate({
      path: 'classes',
      match: { year: selectedYear },
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
  const User = require('../../models/userModel');

  let { courseId, selectedYear } = req.params;

  var course = {};

  if (courseId == 'new') {
    course = {
      name: '',
      years: [selectedYear],
      classFee: 0,
      firstSemester: {
        materialFee: 0,
      },
      secondSemester: {
        materialFee: 0,
      },
      grade: {
        min: 'K',
        max: '12th'
      },
      classSize: {
        min: 4,
        max: 12,
      },
      teachercourse: [
        {
          _id: '',
          teacher: {
            _id: '',
            firstName: '',
            lastName: '',
          },
        },
      ],
    };
    console.log(course);
  } else {
    course = await Course.findOne({ _id: courseId }).populate({
      path: 'teachercourse',
      justOne: true,
      populate: {
        path: 'teacher',
        select: 'firstName lastName _id',
        justOne: true,
      },
    });
  }

  const teachers = await User.find({
    roles: 'teacher',
    registrationYears: '2022-2023',
  }).sort('lastName');

  const years = await Year.find();

  console.log(course);

  res.status(200).render('courses/course_profile', {
    title: `${course.name}`,
    course,
    selectedYear,
    teachers,
    years,
  });
});
