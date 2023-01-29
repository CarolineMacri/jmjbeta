const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');

exports.getTeacherProfile = catchAsync(async (req, res, next) => {
  const User = require('../../models/userModel');

  let { userId } = req.params;

  var teacher = await User.aggregate()
    .match({ _id: mongoose.Types.ObjectId(userId) })
    .lookup({
      from: 'teachers',
      localField: '_id',
      foreignField: 'teacher',
      as: 'teacher',
    })
    .addFields({
      bio: { $first: '$teacher.bio' },
      teacherId: { $first: '$teacher._id' },
    })
    .project({ firstName: 1, lastName: 1, bio: 1, teacherId: 1 });

  teacher = teacher[0];

  console.log(teacher);
  
  res.status(200).render('teachers/teacher_profile', {
    title: `Teacher Info`,
    teacher,
  });
});

exports.getTeachersTable = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const User = require('../../models/userModel');

  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  var teachers = await User.find(
    JSON.parse(`{"yearRoles.${selectedYear}":"teacher"}`)
  )

    .sort('lastName')
    .populate({ path: 'courses', match: { years: selectedYear } })
    .populate({ path: 'teacher', justOne: true });

  // user with year role teacher unchecked but without and existing teacher record
  teachers = teachers.filter(teacher => (teacher.teacher.length > 0))

  //console.log(teachers[0]);
  res.status(200).render('teachers/teachers_table', { 
    title: `Teachers ${selectedYear}`,
    teachers,
    years,
    selectedYear,
  });
});
