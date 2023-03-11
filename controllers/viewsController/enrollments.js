const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Year = require('../../models/yearModel');
const Family = require('../../models/familyModel');
const Child = require('../../models/childModel');
const Class = require('../../models/classModel');
const Course = require('../../models/courseModel');

exports.getEnrollmentsTable = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  // used aggregation pipeline to let the database do the work

  const enrollments = await Family.aggregate()
    .match({ year: selectedYear })
    .lookup({
      from: 'users',
      localField: 'parent',
      foreignField: '_id',
      as: 'parent',
    })
    .addFields({
      parent: { $arrayElemAt: ['$parent', 0] },
    })
    .match(JSON.parse(`{"parent.yearRoles.${selectedYear}":"parent"}`))
    .addFields({
      fullName: {
        $concat: ['$parent.lastName', '$parent.firstName'],
      },
    })
    .lookup({
      from: 'children',
      localField: '_id',
      foreignField: 'family',
      as: 'children',
    })
    .addFields({
      children: {
        $filter: {
          input: '$children',
          as: 'child',
          cond: {
            $eq: ['$$child.year', selectedYear],
          },
        },
      },
    })
    .addFields({
      numChildren: {
        $size: '$children',
      },
    })
    .match({
      numChildren: { $gte: 0 },
    })
    .sort('fullName');

  if (enrollments.length == 0) {
    return next(new AppError('There are no families for this year', 404));
  }
  //console.log(enrollments[0]);

  res.status(200).render('enrollments/enrollments_table', {
    title: `Enrollments ${selectedYear}`,
    enrollments,
    years,
    selectedYear,
  });
});

exports.getEnrollmentProfile = catchAsync(async (req, res, next) => {
  let { parentId, selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }
  const classes = await Class.find({ year: selectedYear }).populate('course');
  //console.log(selectedYear);
  const gradeCourseMap = await Course.getGradeCourseMap(selectedYear);

  //console.log(gradeCourseMap);
  const family = await Family.findOne({ parent: parentId, year: selectedYear });

  let children = await Child.find({ family: family.id, year: selectedYear })
    .select('firstName sex grade _id')
    .populate({
      path: 'enrollments',
      select: 'class course -child',
      populate: {
        path: 'class',
        match: { 'semesterSessions.1': { $gt: 0 } },
        select: 'time hour location course sessions semester _id',
        justOne: true,
        populate: { path: 'course', select: 'name _id', justOne: true },
      },
    });

  children = children.sort(gradeSort);

  children.forEach((child) => {
    child.enrollments = orderEnrollments(child.enrollments);
  });

  res.status(200).render('enrollments/enrollment_profile', {
    title: `Enrollments ${selectedYear}`,
    family,
    children,
    classes,
    gradeCourseMap,
    years,
    selectedYear,
  });
});

function orderEnrollments(enrollments) {
  var tempMap = new Map;
  const hours = Object.values(Class.Times);
  //exclude mass and lunch from enrollments
  const excludedHours = ['8:00AM','12:00PM']
  hours.forEach((hour) => {
    if (!excludedHours.includes(hour)) {
      tempMap.set(hour,
        {
          class:
          {
            hour: hour,
            course: {
              name: '---'
            }
          }
        }
      )
    }
  });
  console.log(tempMap);

  const timeMap = new Map([
    ['9:00AM', { class: { hour: '9:00AM', course: { name: '---' } } }],
    ['10:00AM', { class: { hour: '10:00AM', course: { name: '---' } } }],
    ['11:00AM', { class: { hour: '11:00AM', course: { name: '---' } } }],
    ['12:30PM', { class: { hour: '12:30PM', course: { name: '---' } } }],
    ['other', { class: { hour: 'other', course: { name: '---' } } }],
  ]);
  console.log(timeMap);

  enrollments.forEach((e) => {
    //   const isRegistration = e.class.course.name.includes('Registration');
    //   if (!isRegistration) timeMap.set(e.class.hour, e);
    timeMap.set(e.class.hour, e);
  });

  return [...timeMap.values()];
}

const gradeSort = function (child2, child1) {
  gradeArray = [
    'Infant',
    'PreK3',
    'PreK4',
    'K',
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
    '11th',
    '12th',
    'Adult',
  ];

  return gradeArray.indexOf(child2.grade) - gradeArray.indexOf(child1.grade);
};
