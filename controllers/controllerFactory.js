const pluralize = require('pluralize');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const {
  splitDataWithMaps,
  setUndefinedMapKeys,
  setMapData,
} = require('../utils/mongooseMapTypeHandlers');

const { Model } = require('mongoose');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    const modelName = Model.modelName.toLowerCase();
    const data = {};

    data[modelName] = newDoc;

    res.status(201).json({
      status: 'success',
      data,
    });
  });

exports.getOne = (Model, popOptions) =>
 
catchAsync(async (req, res, next) =>
{
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  const modelName = Model.modelName.toLowerCase();

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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { dataWithoutMaps, dataMapsOnly } = splitDataWithMaps(Model,req.body);

    var doc = await Model.findById(req.params.id);
    if (doc) await doc.updateOne(dataWithoutMaps);

    doc = setUndefinedMapKeys(dataMapsOnly, doc);
    doc = await doc.save();

    if (doc) {
      doc = setMapData(doc, dataMapsOnly);
      await doc.save();
      doc = await Model.findById(req.params.id);
    }

    const modelName = Model.modelName.toLowerCase();

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

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new AppError(`No ${Model.modelName} document found with that ID`, 404)
      );
    }

    res.status(204).json({
      status: 'success',
      data: null, //restful api don't send data back for a delete operation
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //to alloiw for nested GET family on Payments (hack)

    const features = new APIFeatures(Model.find(), req.query) //pass query object and query string
      .filter()
      .sort()
      .paginate()
      .limitFields();
    const docs = await features.dbQuery;

    const modelName = pluralize(Model.modelName.toLowerCase());
    const data = {};
    data[modelName] = docs;

    // SEND RESPONSE3
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data,
    });
  });
