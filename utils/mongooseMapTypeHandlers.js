exports.splitDataWithMaps = (Model, data) => {
  const dataMapsOnly = {};
  const dataWithoutMaps = { ...data }; //not a deep clone

  const modelMapKeys = getModelMapKeys(Model);
  const dataKeys = Object.keys(data);
  const mapKeysInData = getIntersection(modelMapKeys, dataKeys);

  var mapDataValue = '';

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
  Object.entries(dataMapsOnly).forEach(([mapKey, mapData]) => {
    
    Object.entries(mapData).forEach(([k, v]) => {
      doc[mapKey].set(k, v);
    });
  });
  return doc;
};

exports.setUndefinedMapKeys = (dataMapsOnly, doc) => {
  const mapKeys = Object.keys(dataMapsOnly);
  const docKeys = Object.keys(doc);
  const undefinedMapKeys = getDifference(mapKeys, docKeys)

  undefinedMapKeys.forEach((mapKey) => (doc[mapKey] = {}));
  return doc;
};


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

getDifference = (arr1, arr2) => {
  return arr1.filter(e=>!arr2.includes(e))
}

