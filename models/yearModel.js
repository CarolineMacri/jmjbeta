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
    coursePreviewOpenDate: {
      type: Date,
      required: [true, 'Course Preview Open Date reqired']
    },
    enrollmentOpenDate: {
      type: Date,
      required: [true, 'Enrollment Open Date required']
    },
    enrollmentCloseDate: {
      type: Date,
      required: [true, 'Enrollment Close Date required']
    }
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
yearSchema.virtual('isCoursePreviewOpen').get(function () {
  const today = Date.now(); 
  const open = this.coursePreviewOpenDate.getTime();

  return (today > open);
});
yearSchema.virtual('isEnrollmentOpen').get(function () {
  const today = Date.now();
  const open = this.enrollmentOpenDate.getTime();
  const close = this.enrollmentCloseDate.getTime();
  console.log(open)
  console.log(today)
  console.log(close)

  return ((open <= today) && (today <= close));
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
yearSchema.statics.getCurrentYearDoc = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc;
};

yearSchema.statics.isRegistrationOpen = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc.isRegistrationOpen
};
yearSchema.statics.isCourseEditingAllowed = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc.isCourseEditingAllowed
};
yearSchema.statics.isCoursePreviewOpen = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc.isCoursePreviewOpen
};
yearSchema.statics.isEnrollmentOpen = async function () {
  const yearDoc = await this.findOne({ current: true });
  return yearDoc.isEnrollmentOpen
};
const Year = mongoose.model('Year', yearSchema);
module.exports = Year;
