// npm modules
const mongoose = require('mongoose');

const Grades = Object.freeze({
  Infant: 'Infant',
  Toddler: 'Toddler',
  PreK3: 'PreK3',
  PreK4: 'PreK4',
  K: 'K',
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
          enum: Object.values(Grades),
        },
        max: {
          type: String,
          enum: Object.values(Grades),
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
    years: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual('classes', {
  ref: 'Class',
  localField: '_id',
  foreignField: 'course',
});

courseSchema.virtual('teachercourse', {
  ref: 'TeacherCourse',
  localField: '_id',
  foreignField: 'course',
});

courseSchema.virtual('grades').get(function () {
  let gradesArray = Object.values(Grades);
  const minGradeIndex = gradesArray.indexOf(this.grade.min);
  const maxGradeIndex = gradesArray.indexOf(this.grade.max);
  gradesArray = gradesArray.slice(minGradeIndex, maxGradeIndex + 1);

  return gradesArray;
});

Object.assign(courseSchema.statics, {
  Grades,
});

courseSchema.statics.getGradeCourseMap = async function (selectedYear) {
  
  const gradeCourseMap = new Map();

  Object.values(Grades).forEach((grade) => {
    gradeCourseMap.set(grade, [])
  });
  
  const courses = await this.find({ year: selectedYear });

  courses.forEach((course) => {
    course.grades.forEach((grade) => {
      gradeCourseMap.get(grade).push(course.name);
    });
  });

  return Object.assign(gradeCourseMap);
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
