const Family = require('../models/familyModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getFamily = factory.getOne(Family);
exports.getAllFamilies = factory.getAll(Family);
exports.updateFamily = factory.updateOne(Family);
exports.deleteFamily = factory.deleteOne(Family);
exports.createFamily = factory.createOne(Family);

exports.restrictEnrollmentStatusTo = (...restrictedEnrollmentStatuses) => {
  return catchAsync(async (req, res, next) => {
    const family = await Family.findById(req.params.id);
    const enrollmentStatus = family.enrollmentStatus;
    const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');

    console.log('ENROLLMENT STATUS ' + enrollmentStatus);
    console.log('IS Admin ' + isAdmin);
    console.log(
      'RESTRICTED ENROLLMENT STATUSES' + restrictedEnrollmentStatuses
    );

    if (!(restrictedEnrollmentStatuses.includes(enrollmentStatus) || isAdmin)) {
      return next(
        new AppError(
          `You do not have permission to change your enrollment status from ${enrollmentStatus}`,
          403
        )
      );
    }
    next();
    //}
  });
};

exports.validateParentOfFamily = catchAsync(async (req, res, next) => {
  const family = await Family.findById(req.params.id);
  const parentIdOfFamily = family.parent.id;
  const userId = req.user.id;
  const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');

  console.log('parent of family ' + parentIdOfFamily);
  console.log('IS Admin ' + isAdmin);
  console.log('userId' + userId);

  if (!(userId == parentIdOfFamily || isAdmin)){
    return next(
      new AppError(`You do not have permission to edit other families`, 403)
    );
  }
  next();
  //}
});
