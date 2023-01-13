// const models = new Map();
// [
//   'Child',
//   'Class',
//   'Course',
//   'Enrollment',
//   'Family',
//   'Teacher',
//   'Teachercourse',
//   'User',
// ].forEach((model) => {
//   models.set(model, require(`../models/${model.toLowerCase()}Model`));
// });

// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// exports.getTest = catchAsync(async (req, res, next) => {

//   const courses = await models
//     .get('Course')
//     .find({ year: '2020-2021' })
//     .sort('name')
//     .populate('classes');

//   const gradeTimeCourseMap = new Map();

//   Object.values(models.get('Course').Grades).forEach((grade) => {
//      let timeCourseMap = new Map();
//      gradeTimeCourseMap.set(grade, timeCourseMap);
//   });

//   let i = 0;
//   courses.forEach((course) => {

//     course.grades.forEach((grade) => {

//       let timeCourseMap = gradeTimeCourseMap.get(grade);

//       course.classes.forEach((c) => {
//         if (!timeCourseMap.has(c.hour)) {
//           timeCourseMap.set(c.hour, []);
//         }
//         timeCourseMap.get(c.hour).push(course.name);
//         i += 1;
//       })
//     })
//   })
//   console.log(gradeTimeCourseMap);
//   console.log(i);
//   console.log(gradeTimeCourseMap.get('K').get('9AM'));

//   let  gradeCourseMap = await models.get('Course').getGradeCourseMap('2020-2021');

//   const docs3 = await models
//     .get('Child')
//     .find({ year: '2020-2021' })
//     .select('firstName sex grade');

//   docs3.forEach((child) => {
//     child.courses = gradeCourseMap.get(child.grade);
//   });

//   const data = {};
//   data['test'] = docs3;

//   // SEND RESPONSE3
//   res.status(200).json({
//     status: 'success',
//     results: docs3.length,
//     data,
//   });
// });
