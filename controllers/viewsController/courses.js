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

  const courses = await Course.find({ year: selectedYear }).sort({ name: 1 });

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
      id: 'new',
      name: '',
      year: [selectedYear],
      classFee: 0,
      firstSemester: {
        materialFee: 0,
      },
      secondSemester: {
        materialFee: 0,
      },
      materialsFee: [
        {
          semester: 1,
          amount: 0
        },
        {
          semester: 2,
          amount: 0
        }
      ],
      grade: {
        min: 'K',
        max: '12th',
      },
      classSize: {
        min: 4,
        max: 12,
      },
      teachercourse: [
        {
          _id: 'new',
          teacher: {
            _id: '',
            firstName: '',
            lastName: '',
          },
        },
      ],
    };
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
    'registration.roles': 'teacher',
    'registration.year': selectedYear,
  }).sort('lastName');

  const years = await Year.find();

  res.status(200).render('courses/course_profile', {
    title: `${course.name}`,
    course,
    selectedYear,
    teachers,
    years,
  });
});
