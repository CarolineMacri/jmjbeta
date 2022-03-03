// npm modules
const mongoose = require('mongoose');

// project modules
const User = require('./userModel');
const Child = require('./childModel');

const familySchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: User },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

familySchema.virtual('children', {
  ref: Child,
  localField: '_id',
  foreignField: 'family',
});

familySchema.virtual('surName').get(function () {
  if (this.parent) return this.parent.lastName;
});
familySchema.virtual('fullName').get(function () {
  if (this.parent) return this.parent.lastName + this.parent.firstName;
});

familySchema.path('parent').validate(function (parent) {
  if (!parent) {
    return false;
  }
  return true;
}, 'Family needs to have a parent');

familySchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'children',
      select: 'year family sex grade firstName -_id -family',
    },
    {
      path: 'parent',
      select: 'firstName lastName address email cellPhone roles -_id',
    },
  ]);

  next();
});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;
