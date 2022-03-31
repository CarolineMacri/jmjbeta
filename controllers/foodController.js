const catchAsync = require('../utils/catchAsync');const Food = require('../models/foodModel');
const factory = require('./controllerFactory');

exports.getFood = factory.getOne(Food);
exports.getAllFoods = factory.getAll(Food);
//exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);
exports.createFood = factory.createOne(Food);

exports.updateFood = catchAsync(async (req, res, next) => {
  // remove and save the map to be updated later with setters
  //const kind = req.body.kind;
  //delete req.body.kind;

  var doc = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // get all the map schmematypes
    var maps = getMaps(Food);
    console.log(maps);
    const keys = Object.keys(req.body);
    console.log(keys);
    maps = [...maps.filter(e => keys.includes(e))];
    console.log(maps);

  // set the map entries
    
    maps.forEach(map => {
        const m = req.body[map];
        delete req.body[map];
        if (m) {
            console.log(map.toString().toUpperCase() + '---------------------------');
            Object.entries(m).forEach(([k, v]) => {
                console.log(`setting ${k} :  ${v}`);
                doc[map].set(k, v);
            });
            
        }
    });

  doc = await doc.save();
  console.log(doc.kind.get('2021-2022'));

  

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

getMaps = (Model) => {
    var maps = [];
    Object.entries(Model.schema.obj).forEach(([k, v])=> {
        if (Model.schema.path(k).instance == 'Map') {
            maps.push(k)
        }
        
    });
    return maps;
};
