//CORE modules
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const pug = require('pug');

const catchAsync = require('../../utils/catchAsync');
const logger = require('../../utils/logger');
const Child = require('../../models/childModel');
const Class = require('../../models/classModel');
const Course = require('../../models/courseModel');
const Family = require('../../models/familyModel');
const Teacher = require('../../models/teacherModel');
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
  console.log(__dirname);

  const html = pug.renderFile(
    path.join(__dirname, '../../views/reports/childrenByGrade.pug'),
    {
      title: 'Children By Grade',
      gradeLists,
      years,
      selectedYear,
    }
  );
  fs.writeFileSync(
    path.join(__dirname, '../../attachments/childrenByGrade.html'),
    html
  );

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
  const existsTeacher = teacher!=null

  const classes = await Class.find(match)
    .sort('hour')
    .populate({
      path: 'enrollments',
      match: { 'drop.status': { $ne: true } },
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
            select: 'lastName email',
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
      const email =child.family.parent.email
      if (existsTeacher) {
        return `${lastName}, ${firstName} - ${grade}  :        ${email}`;
      } else {
        return `${lastName}, ${firstName} - ${grade}`;
      }
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

exports.reportClassListsWithEnrollmentOrder = catchAsync(
  async (req, res, next) => {
    let { selectedYear } = req.params;

    const years = await Year.find();

    if (!selectedYear) {
      selectedYear = await Year.findOne({ current: true });
      selectedYear = selectedYear.year;
    }

    const match = {
      year: selectedYear,
    };

    const classes = await Class.find(match)
      .sort('hour')
      .populate({
        path: 'enrollments',
        match: { 'drop.status': { $ne: true } },
        populate: {
          path: 'child',
          justOne: true,
          populate: {
            path: 'family',
            justOne: true,
            select: 'parent enrollmentStatus submitDate paymentReceived',
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
        select: 'name classSize',
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
      const maxSize = cl.course.classSize.max;
      const enrollments = cl.enrollments.map((enrollment) => {
        const child = enrollment.child;
        const lastName = child.family.parent.lastName;
        const firstName = child.firstName;
        const grade = child.grade;
        const enrollmentStatus = child.family.enrollmentStatus;
        const subDate = formatDate(child.family.submitDate);
        const payDate = formatDate(child.family.paymentReceived.date);
        const enrollmentDate =
          child.family.enrollmentStatus == 'final'
            ? payDate
            : child.family.enrollmentStatus == 'pending'
            ? subDate
            : '';
        return {
          string: `${lastName}, ${firstName} - ${grade} : ${enrollmentStatus} - ${enrollmentDate}`,
          enrollmentStatus,
        };
      });
      // sort children names in alphabetical order
      enrollments.sort((enrollment1, enrollment2) => {
        const statuses = ['final', 'pending', 'none'];
        return (
          statuses.indexOf(enrollment1.enrollmentStatus) -
          statuses.indexOf(enrollment2.enrollmentStatus)
        );
      });

      enrollments.forEach((enrollment) => {
        console.log(enrollment.enrollmentStatus);
      });
      const totalPendingEnrollments = enrollments.filter((enrollment) => {
        return enrollment.enrollmentStatus == 'pending';
      }).length;
      const totalFinalEnrollments = enrollments.filter((enrollment) => {
        return enrollment.enrollmentStatus == 'final';
      }).length;
      const totalUnsubmittedEnrollments = enrollments.filter((enrollment) => {
        return enrollment.enrollmentStatus == 'none';
      }).length;

      const junk = classMap.get(hour).set(location, {
        className: className,
        totalPendingEnrollments,
        totalFinalEnrollments,
        totalUnsubmittedEnrollments,
        enrollments: enrollments,
        maxSize,
      });
    });

    res.status(200).render('reports/classListsWithEnrollmentOrder', {
      title: 'ClasslistsWithEnrollmentOrder',
      classMap,
      years,
      selectedYear,
    });
  }
);

exports.reportInvoices = catchAsync(async (req, res, next) => {
  let { selectedYear, parent } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var pipeline1 = [];
  var invoiceFirstSemesterPipeline = [];
  var invoiceSecondSemesterPipeline = [];

  if (parent) {
    invoiceFirstSemesterPipeline = invoiceFirstSemesterPipeline.concat([
      {
        $match: { _id: mongoose.Types.ObjectId(parent) },
      },
    ]);
    invoiceSecondSemesterPipeline = invoiceSecondSemesterPipeline.concat([
      {
        $match: { _id: mongoose.Types.ObjectId(parent) },
      },
    ]);
  }

  invoiceFirstSemesterPipeline = invoiceFirstSemesterPipeline.concat(
    pipelines.userFamilyChildEnrollmentClassCourseTeacher(selectedYear, '1')
  );
  invoiceSecondSemesterPipeline = invoiceSecondSemesterPipeline.concat(
    pipelines.userFamilyChildEnrollmentClassCourseTeacher(selectedYear, '2')
  );
  // const pipeline =
  //   pipelines.userFamilyChildEnrollmentClassCourseTeacher(selectedYear);

  // pipeline1 = pipeline1.concat(pipeline);

  const familiesFirstSemester = await User.aggregate(
    invoiceFirstSemesterPipeline
  );
  const familiesSecondSemester = await User.aggregate(
    invoiceSecondSemesterPipeline
  );

  res.status(200).render('reports/invoices', {
    title: 'Invoices',
    familiesFirstSemester,
    familiesSecondSemester,
    years,
    selectedYear,
    parent,
  });
});

exports.reportInvoicesWithPayments = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var invoicesWithPaymentsPipeline =
    pipelines.invoicesWithPayments(selectedYear);

  const invoices = await User.aggregate(invoicesWithPaymentsPipeline);
  console.log(JSON.stringify(invoices[0].teachers[0].feesAndPayments));

  res.status(200).render('reports/invoicesWithPayments', {
    title: 'Balances',
    invoices,
    years,
    selectedYear,
  });
});

exports.reportInvoicesWithPaymentsByTeacher = catchAsync(
  async (req, res, next) => {
    let { selectedYear } = req.params;

    const years = await Year.find();

    if (!selectedYear) {
      selectedYear = await Year.findOne({ current: true });
      selectedYear = selectedYear.year;
    }

    var invoicesWithPaymentsByTeacherPipeline =
      pipelines.invoicesWithPaymentsByTeacher(selectedYear);

    const invoices = await User.aggregate(
      invoicesWithPaymentsByTeacherPipeline
    );

    res.status(200).render('reports/invoicesWithPaymentsByTeacher', {
      title: 'Invoices With Payments By Teacher',
      invoices,
      years,
      selectedYear,
    });
  }
);

exports.reportPayments = catchAsync(async (req, res, next) => {
  let { selectedYear, teacher } = req.params;
  //console.log('in report Pyments-----------------------------------------');
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

exports.reportTeachers = catchAsync(async (req, res, next) => {
  let { selectedYear, teacher } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var teachers = await Teacher.find().populate('teacher');

  teachers = teachers.filter((teacher) => {
    var currentYearRoles = teacher.teacher.yearRoles.get(selectedYear);
    if (currentYearRoles) {
      if (currentYearRoles.includes('teacher')) return teacher;
    }
  });

  teachers = teachers.sort((teacher1, teacher2) => {
    return teacher1.teacher.lastName.localeCompare(teacher2.teacher.lastName);
  });
  res.status(200).render('reports/teachers', {
    title: 'Teachers',
    teachers,
    years,
    selectedYear,
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

exports.reportSignUpSheet = catchAsync(async (req, res, next) => {
  let { parentId } = req.params;

  const years = await Year.find();

  //if (!selectedYear) {
  const selectedYear = await Year.getCurrentYearValue();
  //}
  const family = await Family.findOne({ parent: parentId, year: selectedYear });

  const gradeCourseMap = await Course.getGradeCourseMap(selectedYear);

  const classes = await Class.find({ year: selectedYear })
    .select('semesterSessions time')
    .sort('time')
    .populate({
      path: 'teacher',
      justOne: true,
      select: 'firstName lastName -_id',
    })
    .populate({
      path: 'course',
      justOne: true,
      select: 'name semesterMaterialsFee grade notes classFee',
    });

  classes.sort((a, b) => ('' + a.course.name).localeCompare(b.course.name));

  const times = await Class.Times;
  console.log('-------------------------' + JSON.stringify(classes));

  res.status(200).render('reports/signUpSheet', {
    title: 'Sign Up Sheet',
    classes,
    times,
    years,
    family,
    selectedYear,
    gradeCourseMap,
  });
});

function formatDate(dateString) {
  const newDate = new Date(dateString);
  const mdy =
    newDate.getMonth() +
    1 +
    '-' +
    newDate.getDate() +
    '-' +
    newDate.getFullYear();
  //const hm = newDate.getHours() + ':' + newDate.getMinutes();
  const hm = newDate.toTimeString().slice(0, 5);

  return mdy + ' ' + hm;
}
