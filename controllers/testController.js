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
    .find({ registrationYears: '2022-2023', roles: 'teacher' })
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
          match: { year: '2022-2023' },
        },
      },
    });

  const docs2 = await models
    .get('Course')
    .find({ year: '2022-2023' })
    .populate({
      path: 'classes',
      match: { year: '2022-2023' },
    });

  const data = {};
  data['test'] = docs2;

  // SEND RESPONSE3
  res.status(200).json({
    status: 'success',
    results: docs2.length,
    data,
  });
});
