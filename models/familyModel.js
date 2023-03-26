// npm modules
const mongoose = require('mongoose');
const User = require("./userModel");

const EnrollmentStatuses = Object.freeze({
  NONE: 'none',
  PENDING: 'Pending Payments',
  ENROLLED: 'Enrolled',
});

// project modules

const familySchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      justOne: true,
    },
    year: String,
    enrollmentStatus: {
      type: String,
      enum: ['none', 'pending', 'final'],
      default: 'none',
      required: true,
    },
    paymentReceived: {
      date: {
        type: Date,
        default: '3000-01-01',
      },
      order: {
        type: Number,
        default: 0,
      },
    },
    submitDate:
    {
      type: Date,
      default: null
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

familySchema.virtual('children', {
  ref: 'Child',
  localField: '_id', //needs to be '_id' not 'id'
  foreignField: 'family',
});

familySchema.virtual('fullName').get(function () {
  if (this.parent) return this.parent.lastName + ', ' + this.parent.firstName;
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
      select: 'year family sex grade firstName _id -family',
    },
    {
      path: 'parent',
      select:
        'firstName lastName email cellPhone registrationYears yearRoles _id',
      justOne: true,
    },
  ]);

  next();
});

familySchema.pre('findOneAndDelete', async function (next) {
  const familyToDelete = await this.model.findOne(this.getQuery());

  // don't delete if there are children for this family
  const numChildren = familyToDelete.children.length;

  if (numChildren > 0) {
    const enrolledYears = familyToDelete.children.map((child) => {
      child.year;
    });
    throw new Error(
      `Family has children for ${[
        ...new Set(familyToDelete.children.map((child) => child.year)),
      ]}`
    );
  }

  // need to remove the role of family, and possibly the whole yearRole entry on the parent user
  const parentId = familyToDelete.parent._id;
  const familyYear = familyToDelete.year;
  
  var user = await User.findById(parentId)
  var allYearRoles = user.yearRoles
  var updatedYearRoles = allYearRoles.get(familyYear)

  updatedYearRoles = updatedYearRoles.filter((role) => { return role != 'parent' })
  
  // there were other roles for this year
  if (updatedYearRoles.length > 0) {
    allYearRoles.set(familyYear, updatedYearRoles)
  }
  // parent was the only role, so delete the entry for that year
  else { 
    allYearRoles.delete(familyYear)
  }
  user.yearRoles = allYearRoles
  await user.save()
  next();
});

Object.assign(familySchema.statics, {
  EnrollmentStatuses,
});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;
