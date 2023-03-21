const Year = require('../models/yearModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getYear = factory.getOne(Year);
exports.getAllYears = factory.getAll(Year);
exports.updateYear = factory.updateOne(Year);
exports.deleteYear = factory.deleteOne(Year);
exports.createYear = factory.createOne(Year);

exports.changeCurrentYear = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  console.log('-------------------------' + year);
  await Year.setCurrentYear(year);
  res.status(200).json({
    status: 'success',
  });
});

exports.restrictTimeTo = (...restrictedTimes) => {
  return catchAsync(async (req, res, next) => {
    const currentYearDoc = res.locals.currentYearDoc;
    const isAdmin = res.locals.user.currentRoles.includes('admin' || 'sysAdmin')
    const enrollmentAllowed = restrictedTimes.includes('enrollment') && currentYearDoc.isEnrollmentOpen;
   

    if (!(enrollmentAllowed || isAdmin)) {
      return next(
        new AppError(
          `This function is not currently allowed`,
          403
        )
      );
    }
    next();
    //}
  });
};
