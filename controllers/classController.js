const Class = require('../models/classModel');
const factory = require('./controllerFactory');

exports.getClass = factory.getOne(Class);
exports.getAllClasses = factory.getAll(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);
exports.createClass = factory.createOne(Class);