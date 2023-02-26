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
  var family;
 
  // existing child - get family from database
  if (!req.body.family) {
    const child = await Child.findById(req.params.id);
    family = await Family.findById(child.family);
 // new child with family specified in request params
  } else{
    family = await Family.findById(req.body.family);
  }
  const parent = await User.findById(family.parent);

  const currentRoles = await parent.getCurrentRoles();
 
  // to update child, user must either have admin privileges
  // or the same as the parent of the family
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
