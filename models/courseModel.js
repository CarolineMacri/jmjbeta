// npm modules
const mongoose = require('mongoose');

const Grades = Object.freeze({
  Infant: 'Infant',
  Toddler: 'Toddler',
  PreK3: 'PreK3',
  PreK4: 'PreK4',
  K:'K', 
  First: '1st',
  Second: '2nd',
  Third: '3rd',
  Fourth: '4th',
  Fifth: '5th',
  Sixth: '6th',
  Seventh: '7th',
  Eigth: '8th',
  Ninth: '9th',
  Tenth: '10th',
  Eleventh: '11th',
  Twelfth: '12th',
  Adult: 'Adult',
});

const courseSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    grade: {
      type: new mongoose.Schema({
        min: {
          type: String,
          enum: Object.values(Grades)
        },
        max: {
          type: String,
          enum: Object.values(Grades)
        },
      }),
    },
    firstSemester: {
      type: new mongoose.Schema({
        numSessions: Number,
        materialFee: Number,
      }),
    },
    secondSemester: {
      type: new mongoose.Schema({
        numSessions: Number,
        materialFee: Number,
      }),
    },
    classFee: Number,
    classSize: {
      type: new mongoose.Schema({
        min: Number,
        max: Number,
      }),
    },
    quarantinePolicy: String,
    year: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Object.assign(courseSchema.statics, {
  Grades,
})

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
