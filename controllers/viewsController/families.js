const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Year = require('../../models/yearModel');
const Family = require('../../models/familyModel');
const Child = require('../../models/childModel');

exports.getFamily = catchAsync(async (req, res, next) => {
  let { parentId, selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
    res.status(308).redirect(`${parentId}/${selectedYear}`);
  } else {
    const family = await Family.findOne({
      parent: parentId,
      year: selectedYear,
    });

    var children;

    if (family) {

      children = await Child.find({ family: family.id, year: selectedYear })
        .select('firstName sex grade _id')
        .populate({
          path: 'enrollments',
          match: { 'drop.status': {$ne: true} } , 
          select: 'class course -child',
          populate: {
            path: 'class',
            select: 'time hour location course _id',
            justOne: true,
            populate: { path: 'course', select: 'name _id', justOne: true },
          },
        });

      children.forEach((child) => {
        //console.log(child.name)
        child.enrollments.forEach((enrollment) => {
          //console.log(enrollment)
        });
      });

      children = children.sort(gradeSort);

      children.forEach((child) => {
        child.enrollments = orderEnrollments(child.enrollments);
      });
    }

    //res.status(200).render("family", {
    res.status(200).render(`family`, {
      title: 'family',
      family: family,
      children: children?children:null,
      years: years,
      selectedYear,
    });
  }
});

exports.getFamilies = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  // used aggregation pipeline to let the database do the work

  var families = await Family.aggregate()
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
    // .match({
    //   numChildren: { $gte: 0 },
    // })
    .sort('fullName');

  // if (families.length == 0) {
  //   return next(
  //     new AppError(`There are no families for ${selectedYear}`, 404)
  //   );
  // }
  if (families.length > 0) {
    families.forEach((f) => {
      f.children = f.children.sort(gradeSort);
    });
  }

  res.status(200).render('families', {
    title: `Families ${selectedYear}`,
    families,
    years,
    selectedYear,
  });
});

function orderEnrollments(enrollments) {
  const timeMap = new Map([
    ['9:00AM', { class: { hour: '9:00AM', course: { name: '---' } } }],
    ['10:00AM', { class: { hour: '10:00AM', course: { name: '---' } } }],
    ['11:00AM', { class: { hour: '11:00AM', course: { name: '---' } } }],
    ['12:30PM', { class: { hour: '12:30PM', course: { name: '---' } } }],
    ['other', { class: { hour: 'other', course: { name: '---' } } }],
  ]);

  enrollments.forEach((e) => {
    // const isRegistration = e.class.course.name.includes('Registration');
    // if (!isRegistration) timeMap.set(e.class.hour, e);
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
