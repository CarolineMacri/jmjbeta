const catchAsync = require('../../utils/catchAsync');

const Course = require('../../models/courseModel');
const Year = require('../../models/yearModel');
const Family = require('../../models/familyModel');
const Child = require('../../models/childModel');

exports.getChildren = catchAsync(async (req, res, next) => {
  let { parentId, selectedYear } = req.params;

  var years = await Year.find();

  // if coming from the sidenav family, without a  year, therefore limit to current year
  var years = selectedYear
    ? await Year.find()
    : await Year.findCurrentYearOnly();
  selectedYear = selectedYear
    ? selectedYear
    : await Year.getCurrentYearValue();
  // console.log('test years', testYears);
  // console.log('test selected year', testSelectedYear);

  // if (!selectedYear) {
  //   selectedYear = await Year.findOne({ current: true });
  //   years = [selectedYear];
  //   selectedYear = selectedYear.year;
  // }

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
