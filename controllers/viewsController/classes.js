const catchAsync = require('../../utils/catchAsync');
exports.getClassesTable = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const Class = require('../../models/classModel');

  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var classes = {};

  classes = await Class.find({ year: selectedYear })
    .sort({ time: 1, location: 1 })
    .populate({
      path: 'course',
      justOne: true,
    })
    .populate({
      path: 'teacher',
      justOne: true,
      populate: {
        path: 'teacher',
        select: 'firstName, lastName, _id',
        justOne: true,
      },
    });

  res.status(200).render('classes/classes_table', {
    title: `Classes ${selectedYear}`,
    classes,
    years,
    selectedYear,
  });
});

exports.getClassProfile = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const Class = require('../../models/classModel');
  const User = require('../../models/userModel');
  const Course = require('../../models/courseModel');

  let { classId, selectedYear } = req.params;

  // class is not a good variable name, it could be a reserved word

  const courses = await Course.find({ years: selectedYear }).sort({ name: 1 });
  const teachers = await User.find()
    .where(`yearRoles.${selectedYear}`)
    .equals('teacher')
    .sort('lastName');

  var cl = {};
  if (classId == 'new') {
    cl = new Class({
      year: selectedYear,
      course: courses[0],
      teacher: teachers[0],
    });
    //cl = await cl.save();
    cl = await cl.populate({path:'course', justOne: true})
  } else {
    
      cl = await Class.findOne({ _id: classId })
        .populate({
          path: 'course',
          justOne: true,
        })
        .populate({
          path: 'teacher',
          justOne: true,
          populate: {
            path: 'teacher',
            select: 'firstName, lastName, _id',
            justOne: true,
          },
        });
    
  }

  const years = await Year.find();

  const locations = Class.Locations;
  const times = Class.Times;

  res.status(200).render('classes/class_profile', {
    title: `${cl.course.name}`,
    cl,
    courses,
    teachers,
    locations,
    times,
    selectedYear,
    years,
  });
});

exports.getClassGrid = catchAsync(async (req, res, next) => {
  res.status(200).render('classes/class_grid', {
    title: 'Class Grid'
  });
})