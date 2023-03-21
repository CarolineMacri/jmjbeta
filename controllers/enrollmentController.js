const Child = require("../models/childModel");
const Enrollment = require("../models/enrollmentModel");
const Family = require("../models/familyModel");
const factory = require("./controllerFactory");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getEnrollment = factory.getOne(Enrollment);
exports.getAllEnrollments = factory.getAll(Enrollment);
exports.updateEnrollment = factory.updateOne(Enrollment);
exports.deleteEnrollment = factory.deleteOne(Enrollment);
exports.createEnrollment = factory.createOne(Enrollment);

exports.validateParentOfEnrollment = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const child = await Child.findById(req.body.child);
    const family = await Family.findById(child.family);
    const parentIdOfEnrollment = family.parent.id
    
    const userId = req.user.id;
    const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');
  
     if (!(userId == parentIdOfEnrollment || isAdmin)){
       return next(
         new AppError(`You do not have permission to edit other families`, 403)
       );
     }
    next();
  });
  
