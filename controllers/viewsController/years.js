const catchAsync = require('../../utils/catchAsync');
const Year = require('../../models/yearModel');

exports.getYears = catchAsync(async (req, res, next) => {
    const years = await Year.find().sort({ year: -1 });
  
    res.status(200).render('years', {
      title: 'years',
      years,
    });
  });
  