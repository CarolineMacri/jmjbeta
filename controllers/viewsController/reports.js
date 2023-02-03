const mongoose = require('mongoose');

const catchAsync = require('../../utils/catchAsync');
const Child = require('../../models/childModel');
const Class = require('../../models/classModel');
const Course = require('../../models/courseModel');
const User = require('../../models/userModel');
const Year = require('../../models/yearModel');
const { Grades } = require('../../models/courseModel');
const pipelines = require('./pipelines');

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
  let { selectedYear, teacher } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const match = {
    year: selectedYear,
  };
  if (teacher) match.teacher = teacher;

  const classes = await Class.find(match)
    .sort('hour')
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

  // make the map of times=>locations=>enrollments
  const classMap = new Map();
  Object.values(Class.Times).forEach((hour) => {
    const locations = new Map();
    Object.values(Class.Locations).forEach((location) => {
      locations.set(location, {});
    });
    classMap.set(hour, locations); // 9AM, locations
  });

  classes.forEach((cl) => {
    const hour = cl.hour;
    const location = cl.location;
    const teacher = `${cl.teacher.lastName}, ${cl.teacher.firstName}`;
    const className = cl.course.name;
    const enrollments = cl.enrollments.map((enrollment) => {
      const child = enrollment.child;
      const lastName = child.family.parent.lastName;
      const firstName = child.firstName;
      const grade = child.grade;
      return `${lastName}, ${firstName} - ${grade}`;
    });
    // sort children names in alphabetical order
    enrollments.sort((child1, child2) => {
      return child1.localeCompare(child2);
    });

    const junk = classMap.get(hour).set(location, {
      className: className,
      teacher: teacher,
      enrollments: enrollments,
    });
  });

  res.status(200).render('reports/classLists', {
    title: 'Classlists',
    classMap,
    years,
    teacher,
    selectedYear,
  });
});

exports.reportInvoices = catchAsync(async (req, res, next) => {
  let { selectedYear, parent } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var pipeline1 = [];
  if (parent) {
    pipeline1 = pipeline1.concat([
      { $match: { _id: mongoose.Types.ObjectId(parent) } },
    ]);
  }

  const pipeline =
    pipelines.userFamilyChildEnrollmentClassCourseTeacher(selectedYear);

  pipeline1 = pipeline1.concat(pipeline);

  const fams = await User.aggregate(pipeline1);

  res.status(200).render('reports/invoices', {
    title: 'Invoices',
    families: fams,
    years,
    selectedYear,
    parent,
  });
});

exports.reportPayments = catchAsync(async (req, res, next) => {
  let { selectedYear, teacher } = req.params;
  console.log('in report Pyments-----------------------------------------');
  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var pipeline1 = [];
  if (teacher) {
    pipeline1 = pipeline1.concat([
      { $match: { _id: mongoose.Types.ObjectId(teacher) } },
    ]);
  }

  const pipeline = pipelines.teacherPaymentParent(selectedYear);

  pipeline1 = pipeline1.concat(pipeline);

  const teachers = await User.aggregate(pipeline1);

  res.status(200).render('reports/payments', {
    title: 'Payments',
    teachers,
    years,
    selectedYear,
    teacher,
  });
});

exports.reportCourses = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var pipeline = [];

  pipeline = pipeline.concat(pipelines.classCourseTeacher(selectedYear));

  
  const classes = await Class.aggregate(pipeline);

  res.status(200).render('reports/courses', {
    title: 'Courses',
    classes,
    years,
    selectedYear,
  });
});
