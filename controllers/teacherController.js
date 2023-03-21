const Teacher = require("../models/teacherModel");
const factory = require("./controllerFactory");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTeacher = factory.getOne(Teacher);
exports.getAllTeachers = factory.getAll(Teacher);
exports.updateTeacher = factory.updateOne(Teacher);
exports.deleteTeacher = factory.deleteOne(Teacher);
exports.createTeacher = factory.createOne(Teacher);

exports.validateTeacherIsSelf = catchAsync(async (req, res, next) => {
    const teacher = await Teacher.findById(req.params.id);
    const teacherId = teacher.teacher;
    const userId = req.user.id;
    const isAdmin = req.user.currentRoles.includes('admin' || 'sysAdmin');
  
    if (!(userId == teacherId || isAdmin)){
      return next(
        new AppError(`You do not have permission to edit other teachers`, 403)
      );
    }
    next();
  });
