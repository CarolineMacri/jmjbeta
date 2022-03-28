// npm modules
const mongoose = require('mongoose');
const Locations = Object.freeze({
  class1:'Classroom 1',
  class2:'Classroom 2',
  class3:'Classroom 3',
  cafe1:'Cafeteria 1',
  cafe2:'Cafeteria 2',
  cafe3:'Cafeteria 3',
  cafe4:'Cafeteria 4',
  cafe5:'Cafeteria 5',
  cafe6:'Cafeteria 6',
  music:'Music Room',
  conf:'Conference Room',
  wysz:'Wysznyski Hall',
  stage:'Stage'
});
// project modules
const Course = require('./courseModel');

const classSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      enum: Object.values(Locations),
    },
    time: Date,
    year: String,
    course: [{ type: mongoose.Schema.Types.ObjectId, ref: Course }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

classSchema.virtual('hour').get(function () {
  let hour = !!this.time ? this.time.getHours() : '---';
  if (hour != '---') hour = hour < 12 ? `${hour}AM` : `${hour % 12}PM`;
  return hour;
});

Object.assign(classSchema.statics, {
  Locations,
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
