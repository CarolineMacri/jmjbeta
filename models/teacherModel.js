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

teacherSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "owner",
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
