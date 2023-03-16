const pipelines = require('./pipelines');
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

  let { selectedYear } = req.params;
  const years = await Year.find();
  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var classes = await Class.find({ year: selectedYear })
    .sort({ hour: 1, location: 1 })
    .populate({
      path: 'course',
      justOne: true,
      select: 'name grade classSize',
    })
    .populate({
      path: 'enrollments',
      populate: {
        path: 'child',
        justOne: true,
        populate: {
          path: 'family',
          justOne: true,
        },
      },
    });

  // only final or preliminary count as filling up the class
  // classes.forEach((cl) => {
  //   cl.enrollments = cl.enrollments.filter((en) => {
  //     return en.child.family.enrollmentStatus != 'none';
  //   });
  // });

  // const classes = await Class.find({ year: selectedYear })
  //   .sort({ hour: 1, location: 1 })
  //   .populate({
  //     path: 'course',
  //     justOne: true,
  //     select: 'name grade classSize',
  //   })
  //   .populate('enrollments');

  classes.map((cl) => {
    cl.style = `grid-area:${cl.location.replace(/ /g, '')}-${cl.hour.replace(
      /:/g,
      ''
    )};`;

    cl.enrollments = cl.enrollments.filter((en) => {
      return en.child.family.enrollmentStatus != 'none';
    });
    
    cl.isFull = cl.enrollments.length >= cl.course.classSize.max;
    
    cl.slotsLeft = cl.course.classSize.max - cl.enrollments.length;
    return cl;
  });

  const locations = Object.values(Class.Locations);
  const hours = Object.values(Class.Times);
  //console.log('before calling get Grid Areas')
  const gridStyle = getGridAreas(locations, hours);
  //console.log(gridStyle)

  res.status(200).render('classes/class_grid', {
    title: 'Class Grid',
    selectedYear,
    years,
    classes,
    locations,
    hours,
    gridStyle,
  });
});

function getGridAreas(locations, times) {
  //initial gridAreas styl

  var gridAreas = 'grid-template-areas:';
  //add gridAreas for column names of class locations, including blank at the top left
  locations = ['blank'].concat(locations);
  //strip spaces out of locations names - css can't have spaces in style names
  locations = locations.map((l) => {
    return l.replace(/ /g, '');
  });
  // add the columns to the gridArea style
  const columnGridAreas = '"' + locations.join(' ') + '"\n';

  gridAreas = gridAreas.concat(columnGridAreas);
  //get rid of the 'blank' location
  locations.shift();

  //make the gridareas for each row - the time, then location-time for each locations
  times.forEach((time) => {
    const strippedTime = time.replace(/:/g, '');
    var gridRowArray = [];
    //beginning of row is the time
    gridRowArray.push('time-' + strippedTime);

    locations.forEach((l) => {
      gridRowArray.push(l + '-' + strippedTime);
    });

    var rowGridAreas = '"' + gridRowArray.join(' ') + '"\n';

    gridAreas = gridAreas.concat(rowGridAreas);
  });
  return (gridAreas += ';');
}
exports.getClassFees = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const User = require('../../models/userModel');

  let { selectedYear } = req.params;

  const years = await Year.find();
  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }
  const Class = require('../../models/classModel');

  var classes = await Class.find({ year: selectedYear })
    .select('_id semesterSessions teacher isOwner time location')
    .populate({
      path: 'course',
      justOne: true,
      select: 'name owner classFee semesterMaterialsFee',
    })
    .populate({
      path: 'teacher',
      justOne: true,
      select: '_id firstName lastName',
    })
    .sort('');

  //const classesWithStyle =
  classes = classes.map((cl) => {
    const semesters = ['1', '2'];

    var semesterFees = {};

    semesters.forEach((semester) => {
      semesterFees[semester] =
        cl.semesterSessions[semester] * cl.course.classFee;
      if (cl.isOwner)
        semesterFees[semester] += cl.course.semesterMaterialsFee[semester];
    });
    cl.semesterFees = semesterFees;
    return cl;
  });
  //console.log(await classes[3].classFee + '-------------------------------------------------');

  res.status(200).render('classes/class_fees', {
    title: 'Class Fees',
    classes,
    years,
  });
});

// function getGridAreas(locations, times) {
//   //initial gridAreas styl
//   var gridAreas = "grid-template-areas:";
//   //add gridAreas for column names of class locations, including blank at the top left
//   locations = ["blank"].concat(locations);
//   //strip spaces out of locations names - css can't have spaces in style names
//   locations = locations.map((l) => {
//     return l.replace(/ /g, "");
//   });
//   // add the columns to the gridArea style
//   const columnGridAreas = '"' + locations.join(" ") + '"\n';
//   gridAreas = gridAreas.concat(columnGridAreas);

//   //get rid of the 'blank' location
//   locations.shift();

//   //make the gridareas for each row - the time, then location-time for each locations
//   times.forEach((time) => {
//     var gridRowArray = [];
//     //beginning of row is the time
//     gridRowArray.push("time-" + time);

//     locations.forEach((l) => {
//       gridRowArray.push(l + "-" + time);
//     });

//     var rowGridAreas = '"' + gridRowArray.join(" ") + '"\n';

//     gridAreas = gridAreas.concat(rowGridAreas);
//   });
//   return (gridAreas += ";");
// }
