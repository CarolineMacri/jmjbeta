const Child = require('../models/childModel');
const Enrollment = require('../models/enrollmentModel');
const Family = require('../models/familyModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getEnrollment = factory.getOne(Enrollment);
exports.getAllEnrollments = factory.getAll(Enrollment);
exports.updateEnrollment = factory.updateOne(Enrollment);
exports.deleteEnrollment = factory.deleteOne(Enrollment);
exports.createEnrollment = factory.createOne(Enrollment);

exports.validateParentOfEnrollment = catchAsync(async (req, res, next) => {
  var childId;
  
  if (req.body.child) {
    //new and updated enrollments have the child on the request
    childId = req.body.child;
  } else {
    // deleted enrollments have only the enrollment Id, must find the child
    let { id } = req.params;
    // const enrollment = await Enrollment.findById(req.body._id);
    const enrollment = await Enrollment.findById(id);
    childId = enrollment.child;
  }
  
  const child = await Child.findById(childId);
  const family = await Family.findById(child.family._id);
  const parentIdOfEnrollment = family.parent.id;

  const userId = req.user.id;
  const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');

  if (!(userId == parentIdOfEnrollment || isAdmin)) {
    return next(
      new AppError(`You do not have permission to edit other families`, 403)
    );
  }
  next();
});
