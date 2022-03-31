const catchAsync = require('../utils/catchAsync');
const Food = require('../models/foodModel');
const factory = require('./controllerFactory');

exports.getFood = factory.getOne(Food);
exports.getAllFoods = factory.getAll(Food);
//exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);
exports.createFood = factory.createOne(Food);

exports.updateFood = catchAsync(async (req, res, next) => {
  
  const { dataWithoutMaps, dataMapsOnly } = splitDataWithMaps(Food, req.body);
  
  var doc = await Food.findByIdAndUpdate(req.params.id, dataWithoutMaps, {
    new: true,
    runValidators: true,
  });

  if (doc) {
    doc = setMapData(doc, dataMapsOnly);
    doc = await doc.save();
  }
  
  
  const modelName = Food.modelName.toLowerCase();

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that ID`, 404));
  }

  const data = {};
  data[modelName] = doc;

  res.status(200).json({
    status: 'success',
    data,
  });
});

getModelMapKeys = (Model) => {
  var modelMapKeys = [];
  var modelSchemaDefinition = Model.schema.obj;
  var schemaType = '';
  Object.entries(modelSchemaDefinition).forEach(([k, v]) => {
    schemaType = Model.schema.path(k).instance;
    if (schemaType == 'Map') {
      modelMapKeys.push(k);
    }
  });
  return modelMapKeys;
};

getIntersection = (arr1, arr2) => {
  return arr1.filter((e) => arr2.includes(e));
};

splitDataWithMaps = ((Model, data) => {
  const dataMapsOnly = {};
  const dataWithoutMaps = { ...data };  //not a deep clone

  const modelMapKeys = getModelMapKeys(Model);
  const dataKeys = Object.keys(data);
  const mapKeysInData = getIntersection(modelMapKeys, dataKeys);

  var mapDataValue = '';
 
  mapKeysInData.forEach(mapKey => {
    mapDataValue = data[mapKey];
    if (mapDataValue) {
      dataMapsOnly[mapKey] = mapDataValue
    }
    delete dataWithoutMaps[mapKey]
  }) 
  return { dataWithoutMaps, dataMapsOnly } 
 });

setMapData = ((doc, dataMapsOnly) => {
  Object.entries(dataMapsOnly).forEach(([mapKey, mapData])=> {
    Object.entries(mapData).forEach(([k, v])=> {
      doc[mapKey].set(k, v);
    })
  })
  return doc;
 })