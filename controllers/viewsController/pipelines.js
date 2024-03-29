//  pipelines for use in various queries for
// class records grouped by family, grouped by teacher
exports.userFamilyChildEnrollmentClassCourseTeacher = (year, semester) => {
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
    { $match: { 'enrollment.drop.status': { $ne: true } } },
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
      $match: { 'course.name': { $ne: 'Family Registration' } },
    },
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

  if (semester == '1') {
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
  }

  if (semester == '2') {
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
              price: '$costClasses.2',
              materials: '$costMaterials.2',
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
            $sum: '$costClasses.2',
          },
          materialsFee: {
            $sum: '$costMaterials.2',
          },
          total: {
            $sum: {
              $add: ['$costMaterials.2', '$costClasses.2'],
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
  }

  return pipeline;
};

exports.teachersWithFamilyEnrollmentsAndPayments = (year) => {
  // this will start with teachers

  var pipeline = [];

  //get user information for teachers from the specified year
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'users',
        localField: 'teacher',
        foreignField: '_id',
        as: 'teacher',
      },
    },
    { $match: JSON.parse(`{"yearRoles.${year}":"teacher"}`) },
    {
      $unwind: {
        path: '$teacher',
      },
    },
  ]);

  // get all the classes the teacher is teaching this year
  // along with the course discription
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'classes',
        localField: 'teacher._id',
        foreignField: 'teacher',
        as: 'class',
      },
    },
    {
      $unwind: {
        path: '$class',
      },
    },
    {
      $match: {
        'class.year': year,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'class.course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: {
        path: '$course',
      },
    },
  ]);

  // get all of the enrollments
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'enrollments',

        localField: 'class._id',
        foreignField: 'class',
        as: 'enrollment',
      },
    },
    {
      $unwind: {
        path: '$enrollment',
      },
    },
  ]);

  // get all the children and family info of the enrollees
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'children',
        localField: 'enrollment.child',
        foreignField: '_id',
        as: 'child',
      },
    },
    {
      $unwind: {
        path: '$child',
      },
    },
    {
      $lookup: {
        from: 'families',
        localField: 'child.family',
        foreignField: '_id',
        as: 'family',
      },
    },
    {
      $unwind: {
        path: '$family',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'family.parent',
        foreignField: '_id',
        as: 'parent',
      },
    },
    {
      $unwind: {
        path: '$parent',
      },
    },
  ]);

  // inital group to get teacher parent combo with array of enrolled children
  // sorted by parent names
  pipeline = pipeline.concat([
    {
      $group: {
        _id: {
          teacherId: '$teacher._id',
          parentId: '$parent._id',
        },
        teacher: {
          $first: '$teacher',
        },
        parent: {
          $first: '$parent',
        },
        enrollments: {
          $push: {
            course: '$course',
            child: '$child',
          },
        },
      },
    },
    {
      $sort: {
        'parent.lastName': 1,
        'parent.firstName': 1,
      },
    },
  ]);

  //get an array of payments that match both parent and teacher
  pipeline = pipeline.concat([
    {
      $lookup: {
        from: 'payments',
        let: {
          parent: '$parent',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$parent._id', '$parent'],
              },
            },
          },
        ],
        localField: 'teacher._id',
        foreignField: 'teacher',
        as: 'payments',
      },
    },
  ]);

  // final grouping of families under teacher, sorted by teacher name
  pipeline = pipeline.concat([
    {
      $group: {
        _id: '$teacher._id',
        teacher: {
          $first: '$teacher',
        },
        families: {
          $push: {
            parent: '$parent',
            enrollments: '$enrollments',
            payments: '$payments',
          },
        },
      },
    },
    {
      $sort: {
        'teacher.lastName': 1,
        'teacher.firstName': 1,
      },
    },
  ]);
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
    { $match: { year: year } },
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

exports.invoicesWithPaymentsByTeacher = (year) => {
  var pipeline = [
    // all parents for year
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
    // all children in each family
    {
      $lookup: {
        from: 'children',
        localField: 'family._id',
        foreignField: 'family',
        as: 'child',
      },
    },
    { $unwind: '$child' },
    // all enrollments for each child - many to many child id to class id
    {
      $lookup: {
        from: 'enrollments',
        localField: 'child._id',
        foreignField: 'child',
        as: 'enrollment',
      },
    },
    { $unwind: '$enrollment' },

    // don't include dropped classes
    { $match: { 'enrollment.drop.status': { $ne: true } } },

    // get the class info for this years classes
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

    // get course name and teacher id for class
    {
      $lookup: {
        from: 'courses',
        localField: 'class.course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    { $match: { 'course.name': { $ne: 'Family Registration' } } },

    // get the teacher names
    {
      $lookup: {
        from: 'users',
        localField: 'class.teacher',
        foreignField: '_id',
        as: 'teacher',
      },
    },
    { $unwind: '$teacher' },

    // calculate costs for each class for each semester
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

    //group everything under each teacher
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
            semester: {
              1: {
                price: '$costClasses.1',
                materials: '$costMaterials.1',
              },
              2: {
                price: '$costClasses.2',
                materials: '$costMaterials.2',
              },
            },
          },
        },
        user: { $first: { $concat: ['$lastName', ', ', '$firstName'] } },
        enrollmentStatus: { $first: '$family.enrollmentStatus' },
        teacher: {
          $first: {
            $concat: ['$teacher.lastName', ', ', '$teacher.firstName'],
          },
        },
        classFee1: { $sum: '$costClasses.1' },
        classFee2: { $sum: '$costClasses.2' },
        materialsFee1: { $sum: '$costMaterials.1' },
        materialsFee2: { $sum: '$costMaterials.2' },
        total1: { $sum: { $add: ['$costMaterials.1', '$costClasses.1'] } },
        total2: { $sum: { $add: ['$costMaterials.2', '$costClasses.2'] } },
        numClasses: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'payments',
        as: 'payments1',
        let: { idParent: '$_id.user', idTeacher: '$_id.teacher' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$parent', '$$idParent'] },
                  { $eq: ['$teacher', '$$idTeacher'] },
                  { $eq: ['$year', year] },
                  { $eq: ['$semester', '1'] },
                ],
              },
            },
          },
          {
            $group: {
              _id: '$semester',
              semester: { $first: '$semester' },
              total: { $sum: '$amount' },
              checks: {
                $push: {
                  checkNumber: '$checkNumber',
                  amount: '$amount',
                },
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'payments',
        as: 'payments2',
        let: { idParent: '$_id.user', idTeacher: '$_id.teacher' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$parent', '$$idParent'] },
                  { $eq: ['$teacher', '$$idTeacher'] },
                  { $eq: ['$year', year] },
                  { $eq: ['$semester', '2'] },
                ],
              },
            },
          },
          {
            $group: {
              _id: '$semester',
              semester: { $first: '$semester' },
              total: { $sum: '$amount' },
              checks: {
                $push: {
                  checkNumber: '$checkNumber',
                  amount: '$amount',
                },
              },
            },
          },
        ],
      },
    },
    // {
    //   $addFields: {
    //     payments: {
    //       $cond: [
    //         { $gt: [{ $size: '$payments' }, 0] },
    //         '$payments',
    //         [{ total: 0 }],
    //       ],
    //     },
    //   },
    // },
    // { $set: { payments: { $first: '$payments' } } },
    // {
    //   $addFields: {
    //     payments1: {
    //       $cond: [
    //         { $eq: ['$payments.semester', '1'] },
    //         '$payments',
    //         {
    //           total: 0,
    //           checks: [],
    //         },
    //       ],
    //     },
    //     payments2: {
    //       $cond: [
    //         { $eq: ['$payments.semester', '2'] },
    //         '$payments',
    //         {
    //           total: 0,
    //           checks: [],
    //         },
    //       ],
    //     },
    //   },
    // },
    {
      $set:
      {
        payments1:{$ifNull: [{$first:'$payments1'}, {total:0, checks:[]}]},
        payments2:{$ifNull: [{$first:'$payments2'}, {total:0, checks:[]}]}
      }
    },
    { $sort: { user: 1 } },
    {
      $set: {
        feesAndPayments: {
          1: {
            classFee: '$classFee1',
            materialsFee: '$materialsFee1',
            total: '$total1',
            payments: '$payments1',
          },
          2: {
            classFee: '$classFee2',
            materialsFee: '$materialsFee2',
            total: '$total2',
            payments: '$payments2',
          },
        },
      },
    },
    {
      $unset: [
        'classFee1',
        'classFee2',
        'materialsFee1',
        'materialsFee2',
        'total1',
        'total2',
        'payments',
        'payments1',
        'payments2',
      ],
    },
    {
      $group: {
        _id: '$_id.teacher',
        teacher: { $first: '$teacher' },
        parents: {
          $push: {
            name: '$user',
            enrollmentStatus: '$enrollmentStatus',
            classes: '$classes',
            feesAndPayments: '$feesAndPayments',
          },
        },
        grandTotal: { $sum: '$total' },
      },
    },
    {
      $sort: { teacher: 1 },
    },
  ];
  return pipeline;
};

exports.invoicesWithPayments = (year) => {
  var pipeline = [
    // get families for each each parent this year
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

    // get children for each family
    {
      $lookup: {
        from: 'children',
        localField: 'family._id',
        foreignField: 'family',
        as: 'child',
      },
    },
    { $unwind: '$child' },

    // get enrollments for each child (enrollment merely had child_id, class_id since this is a many-many relationship)
    {
      $lookup: {
        from: 'enrollments',
        localField: 'child._id',
        foreignField: 'child',
        as: 'enrollment',
      },
    },
    { $unwind: '$enrollment' },

    // exclude dropped classes
    // TODO: move this somewhere else,  need to get dropped classes but maybe set the price to zero for cancelled classes
    { $match: { 'enrollment.drop.status': { $ne: true } } },

    // get the class info from the enrollment
    {
      $lookup: {
        from: 'classes',
        localField: 'enrollment.class',
        foreignField: '_id',
        as: 'class',
      },
    },
    { $unwind: '$class' },

    // only this years classes
    { $match: { 'class.year': year } },

    // get the course infor from the class, courses have things like name, pricing
    {
      $lookup: {
        from: 'courses',
        localField: 'class.course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },

    // exclude family registration which is paid earlier
    { $match: { 'course.name': { $ne: 'Family Registration' } } },

    // get the teachers from each course
    {
      $lookup: {
        from: 'users',
        localField: 'class.teacher',
        foreignField: '_id',
        as: 'teacher',
      },
    },
    { $unwind: '$teacher' },

    // calculate the pricing for each semester
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

    // group all of the classes under each teacher
    // TODO : maybe include drops, but if class is a drop, then set price and materials to cost of zero????
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
            semester: {
              1: {
                price: '$costClasses.1',
                materials: '$costMaterials.1',
              },
              2: {
                price: '$costClasses.2',
                materials: '$costMaterials.2',
              },
            },
          },
        },
        user: { $first: { $concat: ['$lastName', ', ', '$firstName'] } },
        enrollmentStatus: { $first: '$family.enrollmentStatus' },
        teacher: {
          $first: {
            $concat: ['$teacher.lastName', ', ', '$teacher.firstName'],
          },
        },
        classFee1: { $sum: '$costClasses.1' },
        classFee2: { $sum: '$costClasses.2' },
        materialsFee1: { $sum: '$costMaterials.1' },
        materialsFee2: { $sum: '$costMaterials.2' },
        total1: { $sum: { $add: ['$costMaterials.1', '$costClasses.1'] } },
        total2: { $sum: { $add: ['$costMaterials.2', '$costClasses.2'] } },
        numClasses: { $sum: 1 },
      },
    },

    // now, handle the payments, which have a semester attribute

    // semester 1 payments matched by teacher and parent ie all of the payments from monastra to rudda

    {
      $lookup: {
        from: 'payments',
        as: 'payments1',
        let: { idParent: '$_id.user', idTeacher: '$_id.teacher' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$parent', '$$idParent'] },
                  { $eq: ['$teacher', '$$idTeacher'] },
                  { $eq: ['$year', year] },
                  { $eq: ['$semester', '1'] },
                ],
              },
            },
          },
          {
            $group: {
              _id: '$semester',
              semester: { $first: '$semester' },
              total: { $sum: '$amount' },
              checks: {
                $push: {
                  checkNumber: '$checkNumber',
                  amount: '$amount',
                },
              },
            },
          },
        ],
      },
    },
    // semester 2 payments matched by teacher and parent ie all of the payments from monastra to rudda
    {
      $lookup: {
        from: 'payments',
        as: 'payments2',
        let: { idParent: '$_id.user', idTeacher: '$_id.teacher' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$parent', '$$idParent'] },
                  { $eq: ['$teacher', '$$idTeacher'] },
                  { $eq: ['$year', year] },
                  { $eq: ['$semester', '2'] },
                ],
              },
            },
          },
          {
            $group: {
              _id: '$semester',
              semester: { $first: '$semester' },
              total: { $sum: '$amount' },
              checks: {
                $push: {
                  checkNumber: '$checkNumber',
                  amount: '$amount',
                },
              },
            },
          },
        ],
      },
    },
    {
      $set: {
        payments1: {
          $ifNull: [{ $first: '$payments1' }, { total: 0, checks: [] }],
        },
      },
    },
    {
      $set: {
        payments2: {
          $ifNull: [{ $first: '$payments2' }, { total: 0, checks: [] }],
        },
      },
    },
    // {
    //   $addFields: {
    //     payments: {
    //       $cond: [
    //         { $gt: [{ $size: '$payments' }, 0] },
    //         '$payments',
    //         [{ total: 0 }],
    //       ],
    //     },
    //   },
    // },
    // { $set: { payments: { $first: '$payments' } } },
    // {
    //   $addFields: {
    //     payments1: {
    //       $cond: [
    //         { $eq: ['$payments.semester', '1'] },
    //         '$payments',
    //         {
    //           total: 0,
    //           checks: [],
    //         },
    //       ],
    //     },
    //     payments2: {
    //       $cond: [
    //         { $eq: ['$payments.semester', '2'] },
    //         '$payments',
    //         {
    //           total: 0,
    //           checks: [],
    //         },
    //       ],
    //     },
    //   },
    // },
    { $sort: { teacher: 1 } },
    {
      $set: {
        feesAndPayments: {
          1: {
            classFee: '$classFee1',
            materialsFee: '$materialsFee1',
            total: '$total1',
            payments: '$payments1',
          },
          2: {
            classFee: '$classFee2',
            materialsFee: '$materialsFee2',
            total: '$total2',
            payments: '$payments2',
          },
        },
      },
    },
    {
      $unset: [
        'classFee1',
        'classFee2',
        'materialsFee1',
        'materialsFee2',
        'total1',
        'total2',
        'payments',
        'payments1',
        'payments2',
      ],
    },
    {
      $group: {
        _id: '$_id.user',
        parent: { $first: '$user' },
        enrollmentStatus: { $first: '$enrollmentStatus' },
        teachers: {
          $push: {
            name: '$teacher',
            classes: '$classes',
            feesAndPayments: '$feesAndPayments',
          },
        },
        grandTotal: { $sum: '$total' },
      },
    },
    {
      $sort: { parent: 1 },
    },
  ];
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
