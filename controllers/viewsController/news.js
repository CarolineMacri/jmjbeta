const catchAsync = require('../../utils/catchAsync');
const Year = require('../../models/yearModel');
const User = require('../../models/userModel');

exports.getNewsTable = catchAsync(async (req, res, next) => {
  const years = await Year.find().sort({ year: -1 });

  res.status(200).render('news/news_table', {
    title: 'years',
    years,
  });
});

exports.getNewProfile = catchAsync(async (req, res, next) => {
  const years = await Year.find().sort({ year: -1 });

  res.status(200).render('news/new_profile', {
    title: 'years',
    years,
  });
});

exports.getNewPage = catchAsync(async (req, res, next) => {
 
  const members = await User.find().sort({lastName:1, firstName: 1})

  res.status(200).render('news/new_page', {
    title: 'New Page',
    members,
  });
});
