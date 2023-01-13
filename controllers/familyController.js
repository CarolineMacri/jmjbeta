const Family = require("../models/familyModel");
const factory = require("./controllerFactory");

exports.getFamily = factory.getOne(Family);
exports.getAllFamilies = factory.getAll(Family);
exports.updateFamily = factory.updateOne(Family);
exports.deleteFamily = factory.deleteOne(Family);
exports.createFamily = factory.createOne(Family);
