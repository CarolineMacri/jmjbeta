const OrderedEnum = require('./orderedEnum.js');

const gradeEnum = new OrderedEnum([
  'Infant',
  'Toddler',
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
]);

const GRADES = new Proxy(gradeEnum, gradeEnum.getterProxy);

module.exports = GRADES;





  



