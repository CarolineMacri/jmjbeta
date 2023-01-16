// npm modules
const mongoose = require("mongoose");

// project modules
const User = require("./userModel");

const paymentSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      justOne: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      justOne:true,
    },
    year: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    checkNumber: {
      type: String,
    },
    semester: { type: String, enum: ["1", "2"], default: "1", required: true },
    notes: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "parent",
      select: "firstName lastName _id",
      justOne: true
    },
    {
      path: "teacher",
      select:
        "firstName lastName _id",
      justOne: true,
    },
  ]);

  next();
});

// classSchema.virtual('enrollments', {
//   ref: 'Enrollment',
//   localField: '_id',
//   foreignField: 'class',
// });

// classSchema.virtual('hour').get(function () {
//   let hour = !!this.time ? this.time : '---';
//   if (hour != '---') hour = Times[hour];
//   return hour;
// });

// classSchema.virtual('classFee').get(async function () {
//   const thisCourse = await Course.findOne({ _id: this.course });
//   return thisCourse.classFee;
// });

// Object.assign(classSchema.statics, {
//   Locations,
//   Times,
// });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
