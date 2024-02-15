// npm modules

const mongoose = require('mongoose');
const Year = require('./yearModel');

const teacherSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bio: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teacherSchema.virtual('courses', {
  ref: 'Course',
  localField: 'teacher', //needs to be '_id' not 'id'
  foreignField: 'owner',
});

teacherSchema.virtual('classes', {
  ref: 'Class',
  localField: 'teacher', //needs to be '_id' not 'id'
  foreignField: 'teacher',
});

teacherSchema.pre('findOneAndDelete', async function (next) {
  const currentYear = await Year.getCurrentYearValue();
  //const currentYear = '2021-2022';
  const teacherToDelete = await this.model
    .findOne(this.getQuery())
    .populate({
      path: 'courses',
      match: { years: currentYear },
    })
    .populate({
      path: 'classes',
      match: { year: currentYear },
    })
    .populate('teacher');

  console.log(
    teacherToDelete.teacher.firstName,
    '__________________________________________'
  );
  console.log(await Year.getCurrentYearValue());
  teacherToDelete.courses.forEach((course) =>
    console.log(course.name, course.years)
  );
  teacherToDelete.classes.forEach((cl) =>
    console.log(cl.year, cl.location, cl.time)
  );

  const numCourses = teacherToDelete.courses.length;
  const numClasses = teacherToDelete.classes.length;

  if (numCourses > 0 || numClasses > 0) {
    throw new Error(
      `Teacher owns ${numCourses} existing courses and has ${numClasses} classes for ${currentYear}`
    );
  }

  //TODO  if no courses or classes for this year, remove 'teacher' from user.yearRoles, 
  //TODO  only remove teacher record if no courses or classes from any year, otherwise it must be kept

  throw new Error(
    'Delete teacher temporarily disabled for testing <br>' +
      teacherToDelete.courses.length +
      ' Courses <br>' +
      teacherToDelete.classes.length +
      ' Classes <br>' +
      'in ' +
      currentYear
  );
  next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
