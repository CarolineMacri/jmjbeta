const Year = require("../models/yearModel");
const factory = require("./controllerFactory");

exports.getYear = factory.getOne(Year);
exports.getAllYears = factory.getAll(Year);
exports.updateYear = factory.updateOne(Year);
exports.deleteYear = factory.deleteOne(Year);
exports.createYear = factory.createOne(Year);
