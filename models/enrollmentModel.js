// npm modules

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      justOne: true,
    },
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
      justOne: true,
    },

    drop: {
      status: { type: Boolean, default: false },
      date: { type: Date },
      reason: { type: String },
    },
    add: {
      status: { type: Boolean, default: false },
      date: { type: Date },
      reason: { type: String },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

enrollmentSchema.index({ class: 1, child: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
