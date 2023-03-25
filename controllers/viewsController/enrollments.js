const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Child = require('../../models/childModel');
const Class = require('../../models/classModel');
const Course = require('../../models/courseModel');
const Enrollment = require('../../models/enrollmentModel');
const Family = require('../../models/familyModel');
const Year = require('../../models/yearModel');

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
  var classes = await Class.find({ year: selectedYear })
    .populate('course')
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

  // only final or pending count as filling up the class
  classes.forEach((cl) => {
    cl.enrollments = cl.enrollments.filter((en) => {
      return en.child.family.enrollmentStatus != 'none';
    });
  });

  const gradeCourseMap = await Course.getGradeCourseMap(selectedYear);

  //console.log(gradeCourseMap);
  const family = await Family.findOne({ parent: parentId, year: selectedYear });

  let children = await Child.find({ family: family.id, year: selectedYear })
    .select('firstName sex grade _id')
    .populate({
      path: 'enrollments',
      match: { 'drop.status': {$ne: true} } ,
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

exports.getEnrollmentAdminProfile = catchAsync(async (req, res, next) => {
  let { enrollmentId, familyId } = req.params;

  var enrollment = {};
  var children = {};
  var family = {};
  var classes = {};

  if (enrollmentId == 'new') {
    family = await Family.findById(familyId).populate('parent');
    const year = family.year;

    // need children an classes for pick list for new enrollment
    children = await Child.find({ family: familyId });
    classes = await Class.find({ year: year }).populate({ path: 'course' });
    classes = classes.sort((cl1, cl2) => {
      const str1 = cl1.course.name;
      const str2 = cl2.course.name;
      return str1.localeCompare(str2);
    });

    enrollment = new Enrollment({
      child: children[0],
      class: classes[0],
    });

    //enrollment = await enrollment.save();

    enrollment = await enrollment.populate({
      path: 'class',
      justOne: true,
      populate: {
        path: 'course',
        justOne: true,
      },
    });
    enrollment.isNew = true;
  } else {
    enrollment = await Enrollment.findById(enrollmentId)
      .populate({
        path: 'child',
        justOne: true,
        populate: {
          path: 'family',
          justOne: true,
        },
      })
      .populate({
        path: 'class',
        justOne: true,
        populate: {
          path: 'course',
          justOne: true,
        },
      });
    enrollment.isNew = false;

    family = await Family.findById(enrollment.child.family.id).populate(
      'parent'
    );
  }
  res.status(200).render('enrollments/enrollment_admin_profile', {
    title: `Enrollment: ${enrollment.child.firstName}`,
    enrollment,
    family,
    children,
    classes,
  });
});

exports.getEnrollmentsAdminFamilyTable = catchAsync(async (req, res, next) => {
  let { parentId, selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const family = await Family.findOne({ parent: parentId, year: selectedYear });

  let children = await Child.find({ family: family.id, year: selectedYear })
    .select('firstName grade _id')
    .populate({
      path: 'enrollments',
      populate: {
        path: 'class',
        match: { 'semesterSessions.1': { $gt: 0 } },
        select: 'course _id',
        justOne: true,
        populate: { path: 'course', select: 'name', justOne: true },
      },
    });

  children = children.sort(gradeSort);

  res.status(200).render('enrollments/enrollments_admin_family_table', {
    title: `Enrollments ${selectedYear}`,
    family,
    children,
    years,
    selectedYear,
  });
});

function orderEnrollments(enrollments) {
  const timeMap = new Map();
  const hours = Object.values(Class.Times);
  //exclude mass and lunch from enrollments
  const excludedHours = ['8:00AM', '12:00PM'];
  hours.forEach((hour) => {
    if (!excludedHours.includes(hour)) {
      timeMap.set(hour, { class: { hour: hour, course: { name: '---' } } });
    }
  });

  enrollments.forEach((e) => {
    timeMap.set(e.class.hour, e);
  });

  return [...timeMap.values()];
}

const gradeSort = function (child2, child1) {
  const gradeArray = Object.values(Course.Grades);
  return gradeArray.indexOf(child2.grade) - gradeArray.indexOf(child1.grade);
};
