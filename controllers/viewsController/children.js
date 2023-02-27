const mongoose = require('mongoose');const catchAsync = require('../../utils/catchAsync');

const Course = require('../../models/courseModel');
const Year = require('../../models/yearModel');
const Family = require('../../models/familyModel');
const Child = require('../../models/childModel');

exports.getChildren = catchAsync(async (req, res, next) => {
  let { parentId, selectedYear } = req.params;

  var years = await Year.find();

  // if coming from the sidenav family, without a  year, therefore limit to current year
  years = selectedYear ? await Year.find() : await Year.findCurrentYearOnly();
  selectedYear = selectedYear ? selectedYear : await Year.getCurrentYearValue();

  const family = await Family.findOne({ parent: parentId, year: selectedYear });

  let children = await Child.find({ family: family.id, year: selectedYear });
  children = children.sort(gradeSort);

  res.status(200).render('children', {
    title: 'children',
    family: family,
    children: children,
    years: years,
    selectedYear,
  });
});

const gradeSort = function (child2, child1) {
  const gradeArray = Object.values(Course.Grades);
  return gradeArray.indexOf(child2.grade) - gradeArray.indexOf(child1.grade);
};

exports.getChildrenTable = catchAsync(async (req, res, next) => {
  let { parentId, selectedYear } = req.params;

  var years = await Year.find();

  // if coming from the sidenav family, without a  year, therefore limit to current year
  years = selectedYear ? await Year.find() : await Year.findCurrentYearOnly();
  selectedYear = selectedYear ? selectedYear : await Year.getCurrentYearValue();
  const isRegistrationOpen = await Year.isRegistrationOpen();

  const family = await Family.findOne({ parent: parentId, year: selectedYear });

  var children = [];
  if (family) {
    children = await Child.find({ family: family.id, year: selectedYear });
    children = children.sort(gradeSort);
  }
  res.status(200).render('children/children_table', {
    title: 'children',
    family: family,
    children: children,
    years: years,
    selectedYear,
    isRegistrationOpen,
  });
});

exports.getChildProfile = catchAsync(async (req, res, next) => {
  let { childId, familyId, selectedYear } = req.params;

  var child = {};
  var parentId = '';
  var family = {};
  if (childId == 'new') {
    family = await Family.findOne({ _id: mongoose.Types.ObjectId(familyId) });
    parentId = family.parent._id;
    child = new Child({
      year: family.year,
      family: family.id,
      firstName: 'child name',
      sex: 'M',
      grade: 'K',
    });
  } else {
    child = await Child.findOne({
      _id: childId,
    });
    family = await Family.findOne({
      _id: mongoose.Types.ObjectId(child.family),
    });
    parentId = family.parent._id;
  }

  console.log('family.parent' + family.parent);

  const isRegistrationOpen = await Year.isRegistrationOpen();

  res.status(200).render('children/child_profile', {
    title: 'Child',
    child,
    selectedYear,
    parentId,
    lastName: family.parent.lastName,
    isRegistrationOpen,
  });
});
