const Family = require('../../models/familyModel');
const Child = require('../../models/childModel');
const Enrollment = require('../../models/enrollmentModel');
const Class = require('../../models/classModel');
//const Course = require('../models/courseModel');
const Year = require('../../models/yearModel');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { ObjectId } = require('mongodb');

Object.assign(
  module.exports,
  require('./courses'),
  require('./children'),
  require('./registrations'),
  require('./families'),
  require('./login'),
  require('./users'),
  require('./reports'),
  require('./years'),
  require('./teachers')
);
