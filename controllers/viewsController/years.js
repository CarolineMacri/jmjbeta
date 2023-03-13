const catchAsync = require('../../utils/catchAsync');
const Year = require('../../models/yearModel');

exports.getYears = catchAsync(async (req, res, next) => {
  const years = await Year.find().sort({ year: -1 });

  res.status(200).render('years', {
    title: 'years',
    years,
  });
});

exports.getYearProfile = catchAsync(async (req, res, next) => {
  let { yearId } = req.params;

  var year = {};

  // INITIALIZE NEW YEAR
  if (yearId == 'new') {
    year = new Year();
  }
  // FILL IN PARENT AND TEACHER INFO FROM EXISTING PAYMENT
  else {
    year = await Year.findOne({ _id: yearId });
  }
  console.log(year);

  res.status(200).render('years/year_profile', {
    title:
      yearId == 'new'
        ? `New year record`
        : `${year.year}`,
    year
  });
});
