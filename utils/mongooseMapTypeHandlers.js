exports.splitDataWithMaps = (Model, data) => {
  const dataMapsOnly = {};
  const dataWithoutMaps = { ...data }; //not a deep clone

  const modelMapKeys = getModelMapKeys(Model);
  const dataKeys = Object.keys(data);
  const mapKeysInData = getIntersection(modelMapKeys, dataKeys);

  var mapDataValue = "";

  mapKeysInData.forEach((mapKey) => {
    mapDataValue = data[mapKey];
    if (mapDataValue) {
      dataMapsOnly[mapKey] = mapDataValue;
    }
    delete dataWithoutMaps[mapKey];
  });
  return { dataWithoutMaps, dataMapsOnly };
};

exports.setMapData = (doc, dataMapsOnly) => {
  // dataMapsOnly looks like this
  // {
  //  animalsMap: {"mammals": ["pig", "dog"], birds: ["chicken", "robin"]},
  //  foodsMap: {"meat":["chicken", "beef", "lamb"], "grains":["wheat","barley", "rice"]}
  // }

  Object.entries(dataMapsOnly).forEach(([mapKey, mapData]) => {
    // for animalsMap
    Object.entries(mapData).forEach(([k, v]) => {
      // set mammals: [pig, dog]
      // set birds: [chicken, robin]
      doc[mapKey].set(k, v);
    });
  });
  return doc;
};

exports.setUndefinedMapKeys = (doc, dataMapsOnly) => {
  // schema has three map types - foodsMap, animalsMap, citiesMap
  // data has citiesMap, animalsMap
  const mapKeys = Object.keys(dataMapsOnly);
  // this particular document only has citiesMap
  const docKeys = Object.keys(doc._doc);
  // animalsMap is undefined on this document
  const undefinedMapKeys = getDifference(mapKeys, docKeys);
  // initialize animalsMap for this document, otherwise setting keys on animals map will result in an error
  undefinedMapKeys.forEach((mapKey) => (doc[mapKey] = {}));
  return doc;
};

getModelMapKeys = (Model) => {
  var modelMapKeys = [];
  var modelSchemaDefinition = Model.schema.obj;
  var schemaType = "";
  Object.entries(modelSchemaDefinition).forEach(([k, v]) => {
    //console.log(`---------------------------${Model.schema.path(k)}: ${k}`);
    if (Model.schema.path(k)) {
      schemaType = Model.schema.path(k).instance;
      if (schemaType == "Map") {
        modelMapKeys.push(k);
      }
    }
  });
  return modelMapKeys;
};

getIntersection = (arr1, arr2) => {
  return arr1.filter((e) => arr2.includes(e));
};

getDifference = (arr1, arr2) => {
  return arr1.filter((e) => !arr2.includes(e));
};
