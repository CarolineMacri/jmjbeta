const catchAsync = require('../../utils/catchAsync');
const Child = require('../../models/childModel');
const Year = require('../../models/yearModel');
const { Grades } = require('../../models/courseModel');

exports.reportChildrenByGrade = catchAsync(async (req, res, next) => {
  let { selectedYear } = req.params;

  const years = await Year.find();

  if (!selectedYear) {
    selectedYear = await Year.findOne({ current: true });
    selectedYear = selectedYear.year;
  }

  const children = await Child.find({ year: selectedYear })
    .populate({
      path: 'family',
      justOne: true,
    })
    
  children.sort
  const gradeLists = new Object;
  Object.values(Grades).forEach((v) => {
    gradeLists[v] = [];
  })
  
  children.forEach((c) => {
    gradeLists[c.grade] = gradeLists[c.grade].concat([c.family.parent.lastName +', '+ c.firstName + " - " + c.sex])
  })

  Object.values(gradeLists).forEach((list) => {
     list.sort();
   })

  res.status(200).render('reportChildrenByGrade', {
    title: 'Children By Grade',
    gradeLists,
    years,
    selectedYear,
  });
});
