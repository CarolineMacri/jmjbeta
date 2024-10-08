// Node modules
const crypto = require("crypto");

// npm modules
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const Year = require("./yearModel");

const userSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: [true, "A last name is required"],
      //validate: [validator.isAlpha, "Last name must be a string"],
    },
    firstName: {
      type: String,
      required: [true, "A first name is required"],
      validate: [validator.isAlpha, "Last name must be a string"],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      validate: [validator.isEmail, "Must be a valid email"],
      unique: [true, "That email is already in use"],
    },
    cellPhone: {
      type: String,
      required: [true, "Cell phone number is required."],
      validate: [validator.isMobilePhone, "Must be a valid phone number"],
    },
    roles: [{ type: String, enum: ["parent", "teacher", "admin"] }],
    registrationYears: [{ type: String }],
    yearRoles: {
      type: Map,
      of: [{ type: String, enum: ["parent", "teacher", "admin","sysAdmin"] }],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("teacher", {
  ref: "Teacher",
  localField: "_id",
  foreignField: "teacher",
});

userSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("classes", {
  ref: "Class",
  localField: "_id",
  foreignField: "teacher",
});

userSchema.virtual("family", {
  ref: "Family",
  localField: "_id",
  foreignField: "parent",
});

userSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "parent",
});

userSchema.methods.isCurrentlyRegistered = async function () {
  const currentYear = await Year.findOne({ current: true });
 
  return this.yearRoles.get(currentYear.year);
  //return this.registrationYears.includes(currentYear.year);
};
userSchema.methods.getCurrentRoles = async function () {
  const currentYear = await Year.findOne({ current: true });
  return this.yearRoles.get(currentYear.year);
};

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.statics.setAllUserPasswords = async function (password) {
  const newPassword = await bcrypt.hash(password, 12);

  const res = await this.updateMany(
    { email: { $exists: true } },
    { password: newPassword }
  );
};
userSchema.statics.setOneUserPassword = async function (email, password) {
  const newPassword = await bcrypt.hash(password, 12);

  const res = await this.updateOne(
    { email: email },
    { password: newPassword }
  );
  console.log('set the user password')
  return;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //console.log('IN CREATER PASSWORD RESET TOKEN ' + this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  //small hack to make sure token is creatd after password has been changed asynchronously
  this.passwordchangedAt = Date.now() - 1000;

  next();
});

userSchema.pre('findOneAndDelete', async function (next) {
  const userToDelete = await this.model
    .findOne(this.getQuery())
    .populate('family')
    .populate('teacher')
    .populate('classes')
    .populate('courses')
    .populate('payments')

  // Check for existing family
  var linkedDocuments = userToDelete.family.length;

  if (linkedDocuments > 0) {
    //const enrolledYears = familyToDelete.children.map(child => { child.year });
    throw new Error(`This user has an existing family record`);
  }

  linkedDocuments = userToDelete['teacher'].length;
  if (linkedDocuments > 0) {
    //const enrolledYears = familyToDelete.children.map(child => { child.year });
    throw new Error(`This user has an existing teacher record`);
  }

  linkedDocuments = userToDelete['payments'].length;
  if (linkedDocuments > 0) {
    throw new Error(`This user has ${linkedDocuments} existing payments`);
  }

  linkedDocuments = userToDelete['courses'].length;
  
  if (linkedDocuments > 0) {
    throw new Error(`This user has ${linkedDocuments} existing courses`);
  }

  linkedDocuments = userToDelete['classes'].length;
  if (linkedDocuments > 0) {
    throw new Error(`This user has ${linkedDocuments} existing classes`);
  }
  next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;
