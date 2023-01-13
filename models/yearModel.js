// npm modules
const mongoose = require("mongoose");
const { update } = require("./userModel");

const yearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: [true, "Year in the format yyyy-yyyy required"],
  },
  current: {
    type: Boolean,
    default: false,
  },
});

yearSchema.statics.setCurrentYear = async function (year) {
  var res = await this.updateOne({ year: year }, { current: true });

  if (!res.ok || !res.n == 1) return false;

  res = await this.updateMany({ year: { $ne: year } }, { current: false });

  return Boolean(res.ok);
};

const Year = mongoose.model("Year", yearSchema);
module.exports = Year;
