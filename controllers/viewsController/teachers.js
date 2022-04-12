const catchAsync = require('../../utils/catchAsync');

exports.getTeacher = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const User = require('../../models/userModel');

  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const teachers = await User.find({
    roles: 'parent',
    year: selectedYear,
  })
    .sort('lastName')
    .populate({ path: 'courses', match: {year:selectedYear}})
    .populate({ path: 'teacher', justOne: true, select: 'bio' });
  
  //(teachers);

  teachers = await User.aggregate()
    .match({ registrationYears: selectedYear, roles: 'teacher' })
    .sort('lastName')
    .project('firstName lastName')
    .lookup({
      from: 'teachercourses',
      localField: '_id',
      foreignField: 'teacher',
      as: 'courses',
      pipeline: [
        {
          $lookup: {
            from: 'courses',
            localField: 'courses',
            foreignField: '_id',
            as: 'courses',
          },
        },
        {
          $match: {
            'courses.year': selectedYear,
          },
        },
      ],
    })
    .addFields({ courses: { $arrayElemAt: ['$courses.courses', 0] } })
    .lookup({
      from: 'teachers',
      localField: '_id',
      foreignField: 'teacher',
      as: 'bio',
    })
    .addFields({ bio: { $arrayElemAt: ['$bio.bio', 0] } });

  res.status(200).render('teacher', {
    title: `Teachers ${selectedYear}`,
    teachers,
    years,
    selectedYear,
  });
});

exports.getTeachers = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  //const Year = require('../../models/yearModel');
  const User = require('../../models/userModel');

  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var teachers = await User.find({
    roles: 'teacher',
    registrationYears: selectedYear,
  })
    .sort('lastName')
    .populate({ path: 'courses', match: {years:selectedYear}})
    .populate({ path: 'teacher', justOne: true });
  
  //(teachers);

  // teachers = await User.aggregate()
  //   .match({ registrationYears: selectedYear, roles: 'teacher' })
  //   .sort('lastName')
  //   .project('firstName lastName')
  //   .lookup({
  //     from: 'teachercourses',
  //     localField: '_id',
  //     foreignField: 'teacher',
  //     as: 'courses',
  //     pipeline: [
  //       {
  //         $lookup: {
  //           from: 'courses',
  //           localField: 'courses',
  //           foreignField: '_id',
  //           as: 'courses',
  //         },
  //       },
  //       {
  //         $match: {
  //           'courses.year': selectedYear,
  //         },
  //       },
  //     ],
  //   })
  //   .addFields({ courses: { $arrayElemAt: ['$courses.courses', 0] } })
  //   .lookup({
  //     from: 'teachers',
  //     localField: '_id',
  //     foreignField: 'teacher',
  //     as: 'bio',
  //   })
  //   .addFields({ bio: { $arrayElemAt: ['$bio.bio', 0] } });

  res.status(200).render('teachers', {
    title: `Teachers ${selectedYear}`,
    teachers,
    years,
    selectedYear,
  });
});
