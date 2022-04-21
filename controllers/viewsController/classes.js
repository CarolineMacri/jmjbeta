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
    cl = await cl.populate({ path: 'course', justOne: true });
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
  const Year = require('../../models/yearModel');
  const Class = require('../../models/classModel');
  const User = require('../../models/userModel');
  const Course = require('../../models/courseModel');

  let { selectedYear } = req.params;
  const years = await Year.find();
  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const classes = await Class.find({ year: selectedYear })
    //.select('time location _id')
    .sort({ time: 1, location: 1 })
    .select('time location')
    .populate({
      path: 'course',
      justOne: true,
      select: 'name grade',
    });

  const classesWithStyle = classes.map((cl) => {
    cl.style = `grid-area:${cl.location
      .replace(/ /g, '')
      .toLowerCase()}-${cl.time.toString()};font-size:1rem;margin:1px;outline:1px solid black;box-shadow: 1px 1px 3px 1px rgb(28 52 110 / 20%);`;
    console.log(cl.course.name, cl.hour, cl.style);
    return cl;
  });

  var locations = ['blank'].concat(Object.values(Class.Locations));

  locations = locations.map((l) => {
    return l.replace(/ /g, '').toLowerCase();
  });

  //locations = ['blank', 'classroom1', 'classroom2']

  //console.log(locations);
  var gridColumnHeaderAreas =
    ' display:grid;grid-template-areas:' + '"' + locations.join(' ') + '"\n';
  var times = Object.keys(Class.Times).map((t) => {
    return t.toLowerCase();
  });
  //times=['9am', '10am']

  locations.shift();
  times.forEach((time) => {
    var gridRow = [];
    gridRow.push('time-' + time);
    locations.forEach((l) => {
      gridRow.push(l + '-' + time);
    });
    var gridRowAreas = '"' + gridRow.join(' ') + '"\n';

    gridColumnHeaderAreas = gridColumnHeaderAreas.concat(gridRowAreas);
  });
  gridColumnHeaderAreas += ';';
  console.log(gridColumnHeaderAreas);
  //   gridStyle =gridStyle.concat(gridRowAreas)
  // })
  // gridStyle =gridStyle.concat(';')
  //gridStyle = gridStyle + ' "a b c d e f g h i j k l m n o" '
  //console.log(gridStyle);
  res.status(200).render('classes/class_grid', {
    title: 'Class Grid',
    selectedYear,
    years,
    classes,
    gridStyle: gridColumnHeaderAreas,
  });
});
