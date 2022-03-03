const Enrollment = require('../models/enrollmentModel');
const factory = require('./controllerFactory');

exports.getEnrollment = factory.getOne(Enrollment);
exports.getAllEnrollments = factory.getAll(Enrollment);
exports.updateEnrollment = factory.updateOne(Enrollment);
exports.deleteEnrollment = factory.deleteOne(Enrollment);
exports.createEnrollment = factory.createOne(Enrollment);