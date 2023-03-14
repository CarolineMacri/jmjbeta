const Year = require("../models/yearModel");
const factory = require("./controllerFactory");
const catchAsync = require('../utils/catchAsync');

exports.getYear = factory.getOne(Year);
exports.getAllYears = factory.getAll(Year);
exports.updateYear = factory.updateOne(Year);
exports.deleteYear = factory.deleteOne(Year);
exports.createYear = factory.createOne(Year);

exports.changeCurrentYear = catchAsync(async (req, res, next) => {
    const year = req.params.year;
    console.log('-------------------------' + year)
    await Year.setCurrentYear(year);
    res.status(200).json({
        status: 'success',
      });
})
