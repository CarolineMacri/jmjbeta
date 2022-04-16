// npm modules
const mongoose = require('mongoose');

// project modules
const Child = require('./childModel');
const Class = require('./classModel');

const enrollmentSchema = new mongoose.Schema(
  {
    drop: {
      type: new mongoose.Schema({
        date: Date,
        reason: String,
      }),
    },
    class: { type: mongoose.Schema.Types.ObjectId, ref: Class },
    child: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Child,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// enrollmentSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'class', select: 'course location time -_id', justOne:true });
//   next();
// })

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
