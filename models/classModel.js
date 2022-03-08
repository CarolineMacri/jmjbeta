// npm modules
const mongoose = require('mongoose');

// project modules
const Course = require('./courseModel');

const classSchema = new mongoose.Schema(
  {
    location: String,
    time: Date,
    year: String,
    course: [{ type: mongoose.Schema.Types.ObjectId, ref: Course }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
  },
);

classSchema.virtual('hour').get(function () {
   
  let hour = !!this.time ? this.time.getHours() : '---';
  if (hour != '---')
    hour = (hour < 12) ? `${hour}AM` : `${hour % 12}PM`;
  return hour;

});
 
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
