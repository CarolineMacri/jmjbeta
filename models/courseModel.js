// npm modules
const mongoose = require("mongoose");

const Grades = Object.freeze({
  Infant: "Infant",
  Toddler: "Toddler",
  PreK3: "PreK3",
  PreK4: "PreK4",
  K: "K",
  First: "1st",
  Second: "2nd",
  Third: "3rd",
  Fourth: "4th",
  Fifth: "5th",
  Sixth: "6th",
  Seventh: "7th",
  Eigth: "8th",
  Ninth: "9th",
  Tenth: "10th",
  Eleventh: "11th",
  Twelfth: "12th",
  Adult: "Adult",
});

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, default: "new" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "required and must be the ObjectId of a user"],
    },
    description: { type: String, default: "New Course" },
    notes: String,
    grade: {
      min: { type: String, enum: Object.values(Grades), default: "K" },
      max: { type: String, enum: Object.values(Grades), default: "12th" },
    },
    // materialsFee: {
    //   type: Array,
    //   of: {
    //     semester: { type: Number, enum: [1, 2], default: 1 },
    //     amount: { type: Number, default: 0 },
    //   },

    //   default: [
    //     { semester: 1, amount: 0 },
    //     { semester: 2, amount: 0 },
    //   ],
    // },
    semesterMaterialsFee: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
    },
    classFee: Number,
    classSize: {
      min: { type: Number, default: 4 },
      max: { type: Number, default: 12 },
    },
    texts: String,
    materials: String,
    years: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual("classes", {
  ref: "Class",
  localField: "_id",
  foreignField: "course",
});

courseSchema.pre('findOneAndDelete', async function (next) {
  const courseToDelete = await this.model
    .findOne(this.getQuery())
    .populate({ path: 'classes' });

  const numClasses = courseToDelete.classes.length;

  if (numClasses > 0) {
    throw new Error(
      `Course has ${numClasses} classes scheduled in ${courseToDelete.years}`
    );
  }
  next();
});

courseSchema.virtual("grades").get(function () {
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
    gradeCourseMap.set(grade, []);
  });

  const courses = await this.find({ years: selectedYear });

  courses.forEach((course) => {
    course.grades.forEach((grade) => {
      gradeCourseMap.get(grade).push(course.name);
    });
  });

  return Object.assign(gradeCourseMap);
};

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
