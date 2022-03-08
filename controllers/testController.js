const models = new Map();
[
  'Child',
  'Class',
  'Course',
  'Enrollment',
  'Family',
  'Teacher',
  'Teachercourse',
  'User',
].forEach((model) => {
  models.set(model, require(`../models/${model.toLowerCase()}Model`));
});

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTest = catchAsync(async (req, res, next) => {
  const docs = await models
    .get('User')
    .find({ registrationYears: '2020-2021', roles: 'teacher' })
    .select('_id lastName')
    .populate({
      path: 'teacher',
      justOne: true,
      select: 'bio',
    })
    .populate({
      path: 'teachercourses',

      populate: {
        path: 'course',
        select: 'name _id',

        populate: {
          path: 'classes',
          select: 'time _id',
        },
      },
    });

  const docs2 = await models.get('Course').find().populate('classes');

  const data = {};
  data['test'] = docs2;

  // SEND RESPONSE3
  res.status(200).json({
    status: 'success',
    results: docs2.length,
    data,
  });
});
