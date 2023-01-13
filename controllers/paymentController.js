const Payment = require("../models/paymentModel");
const factory = require("./controllerFactory");

exports.getPayment = factory.getOne(Payment);
exports.getAllPayments = factory.getAll(Payment);
exports.updatePayment = factory.updateOne(Payment);
exports.deletePayment = factory.deleteOne(Payment);
exports.createPayment = factory.createOne(Payment);
