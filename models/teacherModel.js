// npm modules
const mongoose = require('mongoose');

// project modules
const User = require('./userModel');
const TeacherCourse = require('./teachercourseModel');

const teacherSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: User },
    bio: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teacherSchema.virtual('junk', {
  ref: TeacherCourse,
  localField: 'teacher',
  foreignField: 'teacher',
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
