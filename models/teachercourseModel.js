// npm modules
const mongoose = require('mongoose');

// project modules
const User = require('./userModel');
const Course = require('./courseModel');

const teacherCourseSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: User },
    course: { type: mongoose.Schema.Types.ObjectId, ref: Course },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TeacherCourse = mongoose.model('TeacherCourse', teacherCourseSchema);

module.exports = TeacherCourse;
