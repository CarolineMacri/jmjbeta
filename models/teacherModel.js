// npm modules
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bio: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teacherSchema.pre('findOneAndDelete', async function (next) {
  const teacherToDelete = await this.model
    .findOne(this.getQuery())
    .populate({ path: 'courses' });

  const numCourses = teacherToDelete.courses.length;

  if (numCourses > 0) {
    throw new Error(`Teacher owns ${numCourses} existing courses`);
  }
  next();
})

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
