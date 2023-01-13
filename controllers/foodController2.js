const catchAsync = require("../utils/catchAsync");
const Food = require("../models/foodModel");
const factory = require("./controllerFactory");

exports.getModel = factory.getOne(Food);
exports.getAllModels = factory.getAll(Food);
//exports.updateModel = factory.updateOne(Model);
exports.deleteModel = factory.deleteOne(Food);
exports.createModel = factory.createOne(Food);

exports.updateModel = catchAsync(async (req, res, next) => {
  // remove and save the map to be updated later with setters
  //const kind = req.body.kind;
  //delete req.body.kind;

  var doc = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // get all the map schmematypes
  const modelMapKeys = getModelMapKeys(Food);
  const dataKeys = Object.keys(req.body);
  const mapsKeysInData = getIntersection(modelMapKeys, dataKeys);

  // set the map entries

  mapsKeysInData.forEach((mapKey) => {
    const mapValue = req.body[mapKey];
    delete req.body[mapKey];
    if (mapValue) {
      console.log(
        mapKey.toString().toUpperCase() + "---------------------------"
      );
      Object.entries(mapValue).forEach(([k, v]) => {
        console.log(`setting ${k} :  ${v}`);
        doc[mapKey].set(k, v);
      });
    }
  });

  doc = await doc.save();
  console.log(doc.kind.get("2021-2022"));

  const modelName = Food.modelName.toLowerCase();

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that ID`, 404));
  }

  const data = {};
  data[modelName] = doc;

  res.status(200).json({
    status: "success",
    data,
  });
});

getModelMapKeys = (Model) => {
  const modelMapKeys = [];
  const modelSchemaDefinition = Object.entries(Model.schema.obj);
  var schemaType = "";

  Object.keys(modelSchemaDefinition).forEach((k) => {
    schemaType = Model.schema.path(k).instance;

    if (schemaType == "Map") {
      modelMapKeys.push(k);
    }
  });
  return modelMapKeys;
};

getIntersection = (arr1, arr2) => {
  return arr1.filter((e) => arr2.includes(e));
};

splitDataWithMaps = (mapsKeysInData, data) => {
  //strip map entries out of data and save in own object
  const mapData = {};
  mapsKeysInData.forEach((mapKey) => {
    // get the map data sent as key value pairs
    // myMap: [{myKey1: myValue1}, {myKey2: myValue2}]
    var data = data[mapKey];
    if (data) {
      mapData[mapKey] = data;
    }
    delete data.mapName;
  });
  return dataWithoutMaps, dataWithMapsOnly;
};
