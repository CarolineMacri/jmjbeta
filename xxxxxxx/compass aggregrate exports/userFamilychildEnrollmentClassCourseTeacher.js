[
  {
    $match: {
      "yearRoles.2022-2023": "parent",
    },
  },
  {
    $lookup: {
      from: "families",
      localField: "_id",
      foreignField: "parent",
      as: "family",
    },
  },
  {
    $sort: {
      lastName: 1,
      firstName: 1,
    },
  },
  {
    $unwind: {
      path: "$family",
    },
  },
  {
    $unset: [
      "roles",
      "password",
      "registrationYears",
      "registration",
      "yearRoles",
      "family.year",
      "family.parent",
    ],
  },
  {
    $lookup: {
      from: "children",
      localField: "family._id",
      foreignField: "family",
      as: "child",
      pipeline: [
        {
          $project: {
            sex: 0,
            __v: 0,
          },
        },
        {
          $match: {
            year: "2022-2023",
          },
        },
      ],
    },
  },
  {
    $unwind: "$child",
  },
  {
    $unset: ["child.year", "child.family"],
  },
  {
    $lookup: {
      from: "enrollments",
      localField: "child._id",
      foreignField: "child",
      as: "enrollment",
    },
  },
  {
    $unwind: "$enrollment",
  },
  {
    $lookup: {
      from: "classes",
      localField: "enrollment.class",
      foreignField: "_id",
      as: "class",
    },
  },
  {
    $unwind: "$class",
  },
  {
    $match: {
      "class.year": "2022-2023",
    },
  },
  {
    $unset: ["enrollment", "child._id"],
  },
  {
    $lookup: {
      from: "courses",
      localField: "class.course",
      foreignField: "_id",
      as: "course",
      pipeline: [
        {
          $project: {
            description: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: "$course",
  },
  {
    $lookup: {
      from: "users",
      localField: "class.teacher",
      foreignField: "_id",
      as: "teacher",
      pipeline: [
        {
          $project: {
            firstName: 1,
            lastName: 1,
          },
        },
      ],
    },
  },
  {
    $unwind: "$teacher",
  },
  {
    $set: {
      "costClasses.1": {
        $multiply: ["$course.classFee", "$class.semesterSessions.1"],
      },
      "costMaterials.1": "$course.semesterMaterialsFee.1",
      "costClasses.2": {
        $multiply: ["$course.classFee", "$class.semesterSessions.2"],
      },
      "costMaterials.2": "$course.semesterMaterialsFee.2",
    },
  },
];
