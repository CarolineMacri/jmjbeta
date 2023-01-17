const mongoose = require("mongoose");

const catchAsync = require('../../utils/catchAsync');
const Year = require('../../models/yearModel');
const Payment = require('../../models/paymentModel');
const User = require('../../models/userModel');

exports.getPaymentsTable = catchAsync(async (req, res, next) => {
  const Year = require('../../models/yearModel');
  const Payment = require('../../models/paymentModel');
  const User = require('../../models/userModel');

  let { selectedYear, parentId } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const hasParent = parentId != ' ' && typeof parentId != 'undefined';

  var parentPipeline = [];
  if (hasParent) {
    parentPipeline = [{ '$match': { 'parent': mongoose.Types.ObjectId(parentId) } }];
  }

  var payments = await Payment.aggregate()
    .append(parentPipeline)
    .match({ 'year': selectedYear })
    .lookup({
      from: 'users',
      localField: 'parent',
      foreignField: '_id',
      as: 'parent',
    })
    .addFields({ parent: { $first: '$parent' } })
    .lookup({
      from: 'users',
      localField: 'teacher',
      foreignField: '_id',
      as: 'teacher',
    })
    .addFields({ teacher: { $first: '$teacher' } })
    .sort({'parent.lastName': 1, 'teacher.lastName': 1  });
  
  const parent = await User.findOne({ _id: parentId });
  
  res.status(200).render('payments/payments_table', {
    title: `Payments ${selectedYear}`,
    hasParent,
    parent,
    payments,
    years,
    selectedYear,
  });
});

exports.getPaymentProfile = catchAsync(async (req, res, next) => {
  // const Year = require('../../models/yearModel');
  // const Course = require('../../models/courseModel');
  // const User = require('../../models/userModel');

  let { parentId, selectedYear, paymentId } = req.params;
  //console.log(courseId, selectedYear, ownerId);

  //const hasOwner = typeof ownerId != 'undefined';

  var payment = {};

  if (paymentId == 'new') {
    payment = new Payment();
    payment.year = selectedYear;
    payment.parent = parentId;
  } else {
    payment = await Payment.findOne({ _id: paymentId });
  }

  const parent = await User.findOne({ parent: parentId });
  const parentName = `${parent.lastName}, ${parent.firstName}`;
  //const years = await Year.find();

  res.status(200).render('payments/payment_profile', {
    title: `${selectedYear} payment ${parentName}`,
    payment,
    parent,
  });
});
