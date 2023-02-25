const Child = require('../models/childModel');
const Family = require('../models/familyModel');
const User = require('../models/userModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getChild = factory.getOne(Child);
exports.getAllChildren = factory.getAll(Child);
exports.updateChild = factory.updateOne(Child);
exports.deleteChild = factory.deleteOne(Child);
exports.createChild = factory.createOne(Child);

exports.validateParent = catchAsync(async (req, res, next) => {
  const child = await Child.findById(req.params.id);
  const family = await Family.findById(child.family);
  const parent = family.parent;
  const currentRoles = await parent.getCurrentRoles();
  console.log('------------------ VALIDATING PARENT');
  console.log(req.user);
  console.log(req.params.id);
  console.log(child.family);
  console.log(family.parent._id + typeof family.parent._id);
  console.log(currentRoles);

  const isAdmin = currentRoles.includes('admin' || 'sysAdmin');
  const isParentOfChild =
    req.user._id.toString() == family.parent._id.toString();

  if (!isAdmin) {
    console.log('you are not admin');
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  } else if (!isParentOfChild) {
    console.log('you are not the parent');
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  } else {
      console.log('you are the parent')
  }

  //   const okRoles = req.user.currentRoles.filter((userRole) =>
  //     restrictedRoles.includes(userRole)
  //   );
  //   if (okRoles.length === 0) {
  // );
  //   }
  next();
  //}
});
