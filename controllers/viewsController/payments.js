const mongoose = require('mongoose');

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
    parentPipeline = [
      { $match: { parent: mongoose.Types.ObjectId(parentId) } },
    ];
  }

  var payments = await Payment.aggregate()
    .append(parentPipeline)
    .match({ year: selectedYear })
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
    .sort({ 'parent.lastName': 1, 'teacher.lastName': 1 });

  const parent = await User.findOne({ _id: mongoose.Types.ObjectId(parentId) });

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
  const Payment = require('../../models/paymentModel');
  const User = require('../../models/userModel');

  let { paymentId, selectedYear, parentId } = req.params;

  var payment = {};

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }
  console.log('----------------------', selectedYear);

  const teachers = await User.find()
    .where(`yearRoles.${selectedYear}`)
    .equals('teacher')
    .sort('lastName');

  // INITIALIZE NEW PAYMENT WITH YEAR, PARENT, FIRST TEACHER
  if (paymentId == 'new') {
    payment = new Payment();
    payment.year = selectedYear;
    payment.parent = await User.findOne({
      _id: mongoose.Types.ObjectId(parentId),
    });
    payment.teacher = teachers[0].id;
    payment.amount = 0;
  }
  // FILL IN PARENT AND TEACHER INFO FROM EXISTING PAYMENT
  else {
    const payments = await Payment.aggregate()
      .match({ _id: mongoose.Types.ObjectId(paymentId) })
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
      .addFields({ teacher: { $first: '$teacher' } });

    payment = payments.pop();
  }

  
  var matchParent = {};
  if (parentId) {
    matchParent = { _id: mongoose.Types.ObjectId(parentId) };
  } else if (paymentId != 'new') {
    matchParent = { _id: mongoose.Types.ObjectId(payment.parent._id) };
  }

  const parents = await User.find(matchParent)
    .where(`yearRoles.${selectedYear}`)
    .equals('parent')
    .sort('lastName');

  res.status(200).render('payments/payment_profile', {
    title:
      paymentId == 'new'
        ? `${selectedYear} payment`
        : `${selectedYear} payment ${payment.parent.lastName}`,
    payment,
    teachers,
    parents,
    selectedYear,
    hasParent: (parentId !== undefined)
  });
});
