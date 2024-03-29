// MODELS
const Course = require('../models/courseModel');
// const User = require('../models/userModel');
const Year = require('../models/yearModel');

// FACTORY
const factory = require('./controllerFactory');

// UTILS
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

exports.getCourse = factory.getOne(Course);
exports.getAllCourses = factory.getAll(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);
exports.createCourse = factory.createOne(Course);

exports.validateOwner = catchAsync(async (req, res, next) => {
  // to update a course, either must have admin privileges
  // or be the owner of the course

  const course = await Course.findById(req.params.id);
  const isCourseEditingAllowed = await Year.isCourseEditingAllowed;

  const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');

  // const isTeacher = req.user.currentRoles.includes('teacher');
  const isOwnerOfCourse = req.user._id.toString() == course.owner.toString();
  const canOwnerEdit = isOwnerOfCourse && isCourseEditingAllowed;

  console.log('IS Owner ' + isOwnerOfCourse);
  console.log('IS Admin ' + isAdmin);
  console.log('CAN owner Edit' + canOwnerEdit);

  if (!(canOwnerEdit || isAdmin)) {
    return next(
      new AppError('You do not have permission to perform this action', 483)
    );
  }
  next();
});

exports.filterCourse = catchAsync(async (req, res, next) => {
  console.log('-----berfore-----------' + JSON.stringify(req.body));

  const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');

  if (!isAdmin) {
    const filteredBody = filterObj(
      req.body,
      'id',
      'name',
      'description',
      'notes',
      'semesterMaterialsFee',
      'texts',
      'materials'
    );
    console.log('-----after-----------' + JSON.stringify(filteredBody));

    req.body = filteredBody;
  }
  next();
})