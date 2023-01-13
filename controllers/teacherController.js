const Teacher = require("../models/teacherModel");
const factory = require("./controllerFactory");

exports.getTeacher = factory.getOne(Teacher);
exports.getAllTeachers = factory.getAll(Teacher);
exports.updateTeacher = factory.updateOne(Teacher);
exports.deleteTeacher = factory.deleteOne(Teacher);
exports.createTeacher = factory.createOne(Teacher);
