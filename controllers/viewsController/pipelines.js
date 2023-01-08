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
        parent: {$first:"$user"},
        teachers: {
          $push: {
            name: '$teacher',
            classes: '$classes',
            total: '$total',
          },
        },
        grandTotal: {$sum: "$total"}
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
