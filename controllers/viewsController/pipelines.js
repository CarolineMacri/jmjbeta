//  pipelines for use in various queries for

// class records grouped by family, grouped by teacher
exports.userFamilyChildEnrollmentClassCourseTeacher = (year) => {
  var pipeline = [];

  // get family for each parent
  pipeline = pipeline.concat([
    { $match: JSON.parse(`{"yearRoles.${year}":"parent"}`) },
    {
      $lookup: {
        from: 'families',
        localField: '_id',
        foreignField: 'parent',
        as: 'family',
      },
    },
    { $unwind: { path: '$family' } },
  ]);

  // get children for each parent
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'children',
        localField: 'family._id',
        foreignField: 'family',
        as: 'child',
      },
    },
    { $unwind: '$child' },
  ]);

  // get classes for each child
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'enrollments',
        localField: 'child._id',
        foreignField: 'child',
        as: 'enrollment',
      },
    },
    { $unwind: '$enrollment' },
    {
      $lookup: {
        from: 'classes',
        localField: 'enrollment.class',
        foreignField: '_id',
        as: 'class',
      },
    },
    { $unwind: '$class' },
    { $match: { 'class.year': year } },
  ]);

  //get teacher and courses for each class
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'courses',
        localField: 'class.course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    {
      $lookup: {
        from: 'users',
        localField: 'class.teacher',
        foreignField: '_id',
        as: 'teacher',
      },
    },
    { $unwind: '$teacher' },
  ]);

  //add in material fees, semester fees, etc
  pipeline = pipeline.concat([
    {
      $set: {
        'costClasses.1': {
          $multiply: ['$course.classFee', '$class.semesterSessions.1'],
        },
        'costMaterials.1': '$course.semesterMaterialsFee.1',
        'costClasses.2': {
          $multiply: ['$course.classFee', '$class.semesterSessions.2'],
        },
        'costMaterials.2': '$course.semesterMaterialsFee.2',
      },
    },
  ]);

  pipeline = pipeline.concat([
    {
      $group: {
        _id: {
          user: '$_id',
          teacher: '$teacher._id',
        },
        classes: {
          $push: {
            class: '$course.name',
            student: '$child.firstName',
            price: '$costClasses.1',
            materials: '$costMaterials.1',
          },
        },
        user: {
          $first: {
            $concat: ['$lastName', ', ', '$firstName'],
          },
        },
        teacher: {
          $first: {
            $concat: ['$teacher.lastName', ', ', '$teacher.firstName'],
          },
        },
        classFee: {
          $sum: '$costClasses.1',
        },
        materialsFee: {
          $sum: '$costMaterials.1',
        },
        total: {
          $sum: {
            $add: ['$costMaterials.1', '$costClasses.1'],
          },
        },
        numClasses: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        teacher: 1,
      },
    },
    {
      $group: {
        _id: '$_id.user',
        parent: { $first: '$user' },
        teachers: {
          $push: {
            name: '$teacher',
            classes: '$classes',
            total: '$total',
          },
        },
        grandTotal: { $sum: '$total' },
      },
    },
    {
      $sort: {
        parent: 1,
      },
    },
  ]);

  return pipeline;
};

exports.teacherPaymentParent = (year) => {
  var pipeline = [];

  // get payments for each Teacher
  pipeline = pipeline.concat([
    { $match: JSON.parse(`{"yearRoles.${year}":"teacher"}`) },
    {
      $lookup: {
        from: 'payments',
        localField: '_id',
        foreignField: 'teacher',
        as: 'payment',
      },
    },
    { $unwind: { path: '$payment' } },
    { $match: { 'payment.year': year } },
  ]);

  // parent for each payment
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'users',
        localField: 'payment.parent',
        foreignField: '_id',
        as: 'parent',
      },
    },
    { $unwind: '$parent' },
  ]);

  // get fields for grouping
  pipeline = pipeline.concat([
    {
      $project: {
        teacher: { $concat: ['$lastName', ',', '$firstName'] },
        parent: { $concat: ['$parent.lastName', ',', '$parent.firstName'] },
        checkNumber: '$payment.checkNumber',
        amount: '$payment.amount',
      },
    },
  ]);

  //sub group on parent
  pipeline = pipeline.concat([
    {
      $group: {
        _id: { teacher: '$teacher', parent: '$parent' },
        teacher: { $first: '$teacher' },
        parent: { $first: '$parent' },
        payments: {
          $push: {
            checkNumber: '$checkNumber',
            amount: '$amount',
          },
        },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { parent: 1 } },
  ]);

  //final group on teacher
  pipeline = pipeline.concat([
    {
      $group: {
        _id: '$teacher',
        name: { $first: '$teacher' },
        parents: {
          $push: {
            name: '$parent',
            payments: '$payments',
            total: '$total',
          },
        },
        grandTotal: { $sum: '$total' },
      },
    },
    { $sort: { name: 1 } },
  ]);

  return pipeline;
};

exports.classCourseTeacher = (year) => {
  var pipeline = [];

  // get teacher for each class
  pipeline = pipeline.concat([
   { $match: { "year": year } },
    {
      $lookup: {
        from: 'users',
        localField: 'teacher',
        foreignField: '_id',
        as: 'teacher',
      },
    },
    { $unwind: { path: '$teacher' } },
  ]);

  // course for each class
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: { path: '$course' } },
  ]);
 
  //group a repeated classes show up once
  pipeline = pipeline.concat([
    {
      $group: {
        _id: { teacher: '$teacher._id', course: '$course._id' },
        teacher: { $first: '$teacher' },
        course: { $first: '$course' },
      },
    },
    { $sort: { 'course.name': 1 } },
  ]);
  console.log(pipeline);

  return pipeline;
};

function requireAllModels() {
  const Child = require('../../models/ChildModel');
  const Class = require('../../models/ClassModel');
  const Course = require('../../models/courseModel');
  const Enrollment = require('../../models/enrollmentModel');
  const Family = require('../../models/FamilyModel');
  const Teacher = require('../../models/teacherModel');
  const User = require('../../models/userModel');
  const Year = require('../../models/yearModel');
}
