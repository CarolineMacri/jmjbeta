// npm modules
const mongoose = require("mongoose");

const EnrollmentStatuses = Object.freeze({
  NONE: "NOT Enrolled",
  PENDING: "Pending Payments",
  ENROLLED: "Enrolled",
});

// project modules

const familySchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      justOne: true,
    },
    yearEnrollmentStatus: {
      type: Map,
      of: {
        type: String,
        enum: Object.keys(EnrollmentStatuses),
        default: Object.keys(EnrollmentStatuses)[0],
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

familySchema.virtual("children", {
  ref: "Child",
  localField: "_id", //needs to be '_id' not 'id'
  foreignField: "family",
});

familySchema.virtual("fullName").get(function () {
  if (this.parent) return this.parent.lastName + ", " + this.parent.firstName;
});

familySchema.path("parent").validate(function (parent) {
  if (!parent) {
    return false;
  }
  return true;
}, "Family needs to have a parent");

familySchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "children",
      select: "year family sex grade firstName _id -family",
    },
    {
      path: "parent",
      select:
        "firstName lastName email cellPhone registrationYears yearRoles _id",
      justOne: true,
    },
  ]);

  next();
});

familySchema.pre('findOneAndDelete', async function (next) {
  const familyToDelete = await this.model
    .findOne(this.getQuery());

  const numChildren = familyToDelete.children.length;

  if (numChildren > 0) {
    const enrolledYears = familyToDelete.children.map(child => { child.year });
    throw new Error(`Family has children for ${[...new Set(familyToDelete.children.map(child => child.year))]}`)
  }
  next();
})

Object.assign(familySchema.statics, {
  EnrollmentStatuses,
});

const Family = mongoose.model("Family", familySchema);

module.exports = Family;
