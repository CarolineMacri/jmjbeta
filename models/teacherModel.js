// npm modules
const mongoose = require('mongoose');

// project modules
const User = require('./userModel');
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

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
