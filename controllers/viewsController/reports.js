const catchAsync = require('../../utils/catchAsync');
const Child = require('../../models/childModel');
const Class = require('../../models/classModel');
const Year = require('../../models/yearModel');
const { Grades } = require('../../models/courseModel');

exports.reportChildrenByGrade = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const children = await Child.find({ year: selectedYear }).populate({
    path: 'family',
    justOne: true,
  });

  children.sort;
  const gradeLists = new Object();
  Object.values(Grades).forEach((v) => {
    gradeLists[v] = [];
  });

  children.forEach((c) => {
    gradeLists[c.grade] = gradeLists[c.grade].concat([
      c.family.parent.lastName + ', ' + c.firstName + ' - ' + c.sex,
    ]);
  });

  Object.values(gradeLists).forEach((list) => {
    list.sort();
  });

  res.status(200).render('reports/childrenByGrade', {
    title: 'Children By Grade',
    gradeLists,
    years,
    selectedYear,
  });
});

exports.reportClassLists = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const classes = await Class.find({ year: selectedYear })
    .populate({
      path: 'enrollments',
      populate: {
        path: 'child',
        justOne: true,
        populate: {
          path: 'family',
          justOne: true,
          select: 'parent',
          populate: {
            path: 'parent',
            justOne: true,
            select: 'lastName',
          },
        
        },
      },
    })
    .populate({
      path: 'teacher',
      justOne: true,
      select: 'firstName lastName',
    })
    .populate({
      path: 'course',
      justOne: true,
      select: 'name',
    });

  // children.sort;
  // const gradeLists = new Object();
  // Object.values(Grades).forEach((v) => {
  //   gradeLists[v] = [];
  // });

  // children.forEach((c) => {
  //   gradeLists[c.grade] = gradeLists[c.grade].concat([
  //     c.family.parent.lastName + ', ' + c.firstName + ' - ' + c.sex,
  //   ]);
  // });

  // Object.values(gradeLists).forEach((list) => {
  //   list.sort();
  // });

  classes.sort((cl1, cl2) => {
    return (cl1.time-
      cl2.time
    );
  });
  classes.forEach((cl) => {
    console.log(
      `${cl.course.name}: ${cl.hour} ${cl.location} ${cl.teacher.firstName} ${cl.teacher.lastName}`
    );
    cl.enrollments.sort((e1, e2) => {
      return e1.child.family.parent.lastName.localeCompare(
        e2.child.family.parent.lastName
      );
    });

    //cl.enrollments.forEach((e) =>
      //console.log(
      //  `${e.child.family.parent.lastName},${e.child.firstName} - ${e.child.grade}`
      //)
   // );
    //${cl.enrollment.child.family.parent.lastName},${cl.enrollment.child.firstName} - ${cl.enrollment.child.grade}`)
  });
  res.status(200).render('reports/classLists', {
    title: 'Classlists',
    classes,
    years,
    selectedYear,
  });
});
