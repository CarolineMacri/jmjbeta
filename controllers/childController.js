const Child = require('../models/childModel');
const Family = require('../models/familyModel');
const User = require('../models/userModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
  } else {
    family = await Family.findById(req.body.family);
  }
  const parent = await User.findById(family.parent);

  // to update child, user must either have admin privileges
  // or the same as the parent of the family
  const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');
  const isParentOfChild =
    req.user._id.toString() == family.parent._id.toString();
  console.log('IS Parent ' + isParentOfChild)
  console.log('IS Admin ' + isAdmin)

  if (!(isParentOfChild || isAdmin)) {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  next();
  //}
});
