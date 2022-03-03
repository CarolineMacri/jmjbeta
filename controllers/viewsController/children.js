const catchAsync = require('../../utils/catchAsync');

exports.getChildren = catchAsync(async (req, res, next) => {
  let { parentId, selectedYear } = req.params;

  const Year = require('../../models/yearModel');
  const Family = require('../../models/familyModel');
  const Child = require('../../models/childModel');

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const family = await Family.findOne({ parent: parentId });

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
    gradeArray = [
      'Infant',
      'PreK3',
      'PreK4',
      'K',
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '6th',
      '7th',
      '8th',
      '9th',
      '10th',
      '11th',
      '12th',
      'Adult',
    ];
  
    return gradeArray.indexOf(child2.grade) - gradeArray.indexOf(child1.grade);
  };
