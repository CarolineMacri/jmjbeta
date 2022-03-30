// npm modules
const mongoose = require('mongoose');

// project modules
const foodSchema = new mongoose.Schema(
  {
    kind: {
      type: Map,
      of: [String]
    },
    girl: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// enrollmentSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'class', select: 'course location time -_id', justOne:true });
//   next();
// })

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
