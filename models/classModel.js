// npm modules
const mongoose = require('mongoose');
const Locations = Object.freeze({
  class1: 'Classroom 1',
  class2: 'Classroom 2',
  class3: 'Classroom 3',
  conf: 'Conference Room',
  cafe1: 'Cafeteria 1',
  cafe2: 'Cafeteria 2',
  cafe3: 'Cafeteria 3',
  cafe4: 'Cafeteria 4',
  cafe5: 'Cafeteria 5',
  cafe6: 'Cafeteria 6',
  retreat: 'Retreat House Basement',
  music: 'Music Room',
  wysz: 'Wysznyski Hall Front',
  wysz2: 'Wysznyski Hall Back',
  stage: 'Stage',
  other: 'Other',
  none: 'none'
});

const Times = Object.freeze({
  8: '8:00AM',
  9: '9:00AM',
  10: '10:00AM',
  11: '11:00AM',
  12: '12:00PM',
  13: '12:30PM',
  // 14: "2PM",
  14: 'other',
});

// project modules
const Course = require('./courseModel');
const Enrollment = require('./enrollmentModel');
// const User = require('./userModel');

const classSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isOwner: { type: Boolean, default: true },
    semesterSessions: {
      1: { type: Number, default: 8, min: 1, max: 8, required: true },
      2: { type: Number, default: 8, min: 1, max: 8, required: true },
    },
    // semester: { type: String, enum: ['1', '2'], default: '1', required: true },
    // sessions: { type: Number, default: 8, min: 1, max: 8, required: true },
    location: {
      type: String,
      enum: Object.values(Locations),
      required: true,
      default: Object.values(Locations)[0],
    },
    time: { type: Number, min: 8, max: 15, required: true },
    year: { type: String, required: true },
    isFull: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

classSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'class',
});

classSchema.virtual('hour').get(function () {
  let hour = !!this.time ? this.time : '---';
  if (hour != '---') hour = Times[hour];
  return hour;
});

classSchema.pre('findOneAndDelete', async function (next) {
  const classToDelete = await this.model
    .findOne(this.getQuery())
    .populate({ path: 'enrollments' });

  const numEnrollments = classToDelete.enrollments.length;

  if (numEnrollments > 0) {
    throw new Error(
      `Class has ${numEnrollments} enrollments for ${classToDelete.year}`
    );
  }
  next();
});

Object.assign(classSchema.statics, {
  Locations,
  Times,
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
