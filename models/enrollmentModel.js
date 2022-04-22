// npm modules

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    child:{
      type: mongoose.Schema.Types.ObjectId,ref: 'Child'    },
    
    drop: {
      status: {type: Boolean, default: false},
      date: { type: Date, default: Date.now() },
      reason: { type: String, default: 'Class full' }
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
