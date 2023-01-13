const Course = require("../models/courseModel");
const factory = require("./controllerFactory");

exports.getCourse = factory.getOne(Course);
exports.getAllCourses = factory.getAll(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);
exports.createCourse = factory.createOne(Course);
