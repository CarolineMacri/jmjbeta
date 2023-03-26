const mongoose = require('mongoose');
const { Grades } = require('./courseModel');

const childSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'required and must be a string'],
    },
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Family',
      required: [true, 'required and must be the ObjectId of a family'],
    },
    year: String,
    sex: {
      type: String,
      enum: ['M', 'F'],
      required: [true, 'M or F - only 2 choices'],
    },
    grade: {
      type: String,
      enum: Object.values(Grades),
      required: [true, 'must be a valid grade level'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

childSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'child',
});

childSchema.methods.message = function () {
  return this._id;
};
childSchema.index({ family: 1, year: 1, firstName: 1 }, { unique: true });

childSchema.pre('deleteOne', { document: true, query: false }, function (next) {
  next();
});

childSchema.pre('findOneAndDelete', async function (next) {
  const childToDelete = await this.model
    .findOne(this.getQuery())
    .populate({ path: 'enrollments' });

  const numEnrollments = childToDelete.enrollments.length;

  if (numEnrollments > 0) {
    throw new Error(
      `Child has ${numEnrollments} enrollments for ${childToDelete.year}`
    );
  }
  next();
});
const Child = mongoose.model('Child', childSchema);
module.exports = Child;
