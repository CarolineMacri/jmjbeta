// npm modules

const mongoose = require('mongoose');
const Locations = Object.freeze({
  class1: 'Classroom 1',
  class2: 'Classroom 2',
  class3: 'Classroom 3',
  cafe1: 'Cafeteria 1',
  cafe2: 'Cafeteria 2',
  cafe3: 'Cafeteria 3',
  cafe4: 'Cafeteria 4',
  cafe5: 'Cafeteria 5',
  cafe6: 'Cafeteria 6',
  music: 'Music Room',
  conf: 'Conference Room',
  wysz: 'Wysznyski Hall',
  wysz2: 'Wysznyski Hall 2',
  stage: 'Stage',
});

const Times = Object.freeze({
  9: '9AM',
  10: '10AM',
  11: '11AM',
  12: '12PM',
  13: '1PM',
  14: '2PM',
});

// project modules
// const Course = require('./courseModel');
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
    semester: { type: String, enum: ['1', '2'], default: '1', required: true },
    sessions: { type: Number, default: 8, min: 1, max: 8, required: true },
    location: {
      type: String,
      enum: Object.values(Locations),
      required: true,
      default: Object.values(Locations)[0],
    },
    time: { type: Number, min: 9, max: 15, required: true },
    year: { type: String, required: true },
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

Object.assign(classSchema.statics, {
  Locations,
  Times,
});



const Class = mongoose.model('Class', classSchema);

module.exports = Class;
