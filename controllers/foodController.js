const catchAsync = require('../utils/catchAsync');
const Food = require('../models/foodModel');
const factory = require('./controllerFactory');
const { splitDataWithMaps, setMapData } = require('../utils/mongooseMapTypeHandlers');

exports.getFood = factory.getOne(Food);
exports.getAllFoods = factory.getAll(Food);
exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);
exports.createFood = factory.createOne(Food);

// exports.updateFood = catchAsync(async (req, res, next) => {
  
//   const { dataWithoutMaps, dataMapsOnly } = splitDataWithMaps(Food, req.body);
  
//   var doc = await Food.findByIdAndUpdate(req.params.id, dataWithoutMaps, {
//     new: true,
//     runValidators: true,
//   });

//   if (doc) {
//     doc = setMapData(doc, dataMapsOnly);
//     doc = await doc.save();
//   }
  
  
//   const modelName = Food.modelName.toLowerCase();

//   if (!doc) {
//     return next(new AppError(`No ${modelName} found with that ID`, 404));
//   }

//   const data = {};
//   data[modelName] = doc;

//   res.status(200).json({
//     status: 'success',
//     data,
//   });
// });