const Child = require("../models/childModel");
const factory = require("./controllerFactory");

exports.getChild = factory.getOne(Child);
exports.getAllChildren = factory.getAll(Child);
exports.updateChild = factory.updateOne(Child);
exports.deleteChild = factory.deleteOne(Child);
exports.createChild = factory.createOne(Child);
