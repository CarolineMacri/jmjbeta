// npm modules
const mongoose = require('mongoose');
const { update } = require('./userModel');

const yearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, 'Year in the format yyyy-yyyy required'],
    },
    current: {
      type: Boolean,
      default: false,
    },
    registrationCloseDate: {
      type: Date,
      required: [true, 'registration close date required'],
    },
    courseEditCloseDate: {
      type: Date,
      required: [true, 'Course edit close date required'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

yearSchema.virtual('isRegistrationOpen').get(function () {
  const today = Date.now();
  const close = this.registrationCloseDate.getTime();

  return (today < close);
});
yearSchema.virtual('isCourseEditingAllowed').get(function () {
  const today = Date.now();
  const close = this.courseEditCloseDate.getTime();

  return (today < close);
});

yearSchema.statics.setCurrentYear = async function (year) {
  var res = await this.updateOne({ year: year }, { current: true });

  if (!res.ok || !res.n == 1) return false;

  res = await this.updateMany({ year: { $ne: year } }, { current: false });

  return Boolean(res.ok);
};

yearSchema.statics.findCurrentYearOnly = async function () {
  return await this.find({ current: true });
};

yearSchema.statics.getCurrentYearValue = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc.year;
};

yearSchema.statics.isRegistrationOpen = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc.isRegistrationOpen
};
yearSchema.statics.isCourseEditingAllowed = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc.isCourseEditingAllowed
};
const Year = mongoose.model('Year', yearSchema);
module.exports = Year;
