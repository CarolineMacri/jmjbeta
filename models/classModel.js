// npm modules
const mongoose = require('mongoose');
const Locations = Object.freeze({
 
  confA: 'Conf Room A',  //added new Shrine Rooms
  confB: 'Conf Room B',
  class1: 'Classroom 1',
  class2A: 'Classroom 2a',
  class2B: 'Classroom 2b',
  class3: 'Classroom 3',
  class4: 'Classroom 4',
  class5: 'Classroom 5',
  class6: 'Classroom 6',
  class7: 'Classroom 7',
  class8: 'Classroom 8',
  class9: 'Classroom 9',
  class10: 'Classroom 10',
  cafe: 'Cafeteria',
  stanne: 'Saint Anne Chapel',
  /* sh100: 'SH 100', // added Sacred Heart classrooms
  sh101: 'SH 101',
  sh102: 'SH 102 lab',
  sh113: 'SH 113',
  sh115: 'SH 115',
  sh116: 'SH 116',
  sh118: 'SH 118',
  sh119: 'SH 119',
  sh120: 'SH 120',
  sh121: 'SH 121',
  shcafeteria: 'SH Cafeteria',
  shgym1: 'SH Gym 1',
  shgym2: 'SH Gym 2',
  shgym3: 'SH Gym 3',
  shgymlibrary: 'SH Gym Library',
  shmainchurch: 'SH Main Church',
  shchurchcryroom: 'SH Church Cry Room',
  shchurchlibrary: 'SH Church Library',*/
  // class1: 'Classroom 1',     Czestochowa locations, not used in 2024-2025
  // class2: 'Classroom 2',
  // class3: 'Classroom 3',
  // conf: 'Conference Room',
  // cafe1: 'Cafeteria 1',
  // cafe2: 'Cafeteria 2',
  // cafe3: 'Cafeteria 3',
  // cafe4: 'Cafeteria 4',
  // cafe5: 'Cafeteria 5',
  // cafe6: 'Cafeteria 6',
  // retreat: 'Retreat House Basement',
  // music: 'Music Room',
  // wysz: 'Wysznyski Hall Front',
  // wysz2: 'Wysznyski Hall Back',
  // stage: 'Stage',
  other: 'Other',
  none: 'none',
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
      1: { type: Number, default: 16, min: 1, max: 16, required: true },
      2: { type: Number, default: 0, min: 0, max: 8, required: true },
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
