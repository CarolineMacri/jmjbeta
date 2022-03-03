class APIFeatures {
  constructor(dbQuery, reqQuery) {
    this.dbQuery = dbQuery;
    this.reqQuery = reqQuery;

    // queryString is the req.query object
    // GET(/user?lastName=Macri&city=Oaks&age={gt:1}&sort=lastName.firstName&fields=firstName.lastName.email&page=3&limit=10)
    //  req.query = {
    //    lastName: "Macri",
    //    city: "Oaks",
    //    age: "{gt:1},
    //    sort: "lastName.firstName",
    //    fields: "lastName.firstName.email",
    //    page: 3,
    //    limit:10
    // };
  }

  filter() {
    // filtering is done with query =
    // query.match(
    //   {
    //     lastName: 'Macri',
    //     city: 'Doylestown',
    //     age: { $gte: 1 },
    //   }
    // );
    const matchFields = getMatchFields(this.reqQuery);
    const matchObj = formatMatchForDb(matchFields);
    this.dbQuery = this.dbQuery.find(matchObj);

    return this;
  }

  sort() {
    //sorting is done with query = query.sort('field1 field2')
    if (this.reqQuery.sort) {
      const sortString = formatForDb(this.reqQuery.sort);
      this.dbQuery = this.dbQuery.sort(sortString);
    } else {
      this.dbQuery = this.dbQuery.sort('lastName');
    }

    return this;
  }

  limitFields() {
    // Projection is done with query = query.select("field1 field2 field3")
    if (this.reqQuery.fields) {
      const fieldsString = formatForDb(this.reqQuery.fields);
      this.dbQuery = this.dbQuery.select(fieldsString);
    } else {
      this.dbQuery = this.dbQuery.select('-id'); 
    }

    return this;
  }

  paginate() {
    // pagination is done with query = query.skip(2).limit(10)  1-10 page 1, 11-20, page 2, 21-30 page 3
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.dbQuery = this.dbQuery.skip(skip).limit(limit);
    return this;
  }
}

function getMatchFields(reqQuery) {
  const matchFields = { ...reqQuery }; //shallow copy
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach((field) => delete matchFields[field]);
  return matchFields;
}
function formatMatchForDb(matchFields) {
  let matchString = JSON.stringify(matchFields);
  matchString = matchString.replace(/\b(gte|gt|lte|lt|regex)\b/g, prefix$);
  return JSON.parse(matchString);
}

function formatForDb(sortString) {
  return sortString.split('.').join(' ');
}

function prefix$(match) {
  return `$${match}`;
}

module.exports = APIFeatures;
