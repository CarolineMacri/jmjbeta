const TeacherCourse = require("../models/teachercourseModel");
const factory = require("./controllerFactory");

exports.getTeacherCourse = factory.getOne(TeacherCourse);
exports.getAllTeacherCourses = factory.getAll(TeacherCourse);
exports.updateTeacherCourse = factory.updateOne(TeacherCourse);
exports.deleteTeacherCourse = factory.deleteOne(TeacherCourse);
exports.createTeacherCourse = factory.createOne(TeacherCourse);
