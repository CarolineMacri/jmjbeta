const express = require('express');
const viewsController = require('../controllers/viewsController/index');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getHome);
router.get('/login', viewsController.getLogin);

router.get(
  '/resetPassword/:resetPasswordToken',
  viewsController.getResetPassword
);

router.use(authController.isLoggedIn);

router.get('/splash', authController.protect, viewsController.getSplash);
router.get(
  '/families/:selectedYear?',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getFamilies
);
router.get(
  '/family/:parentId/:selectedYear?',
  authController.protect,
  viewsController.getFamily
);
router.get(
  '/children/:parentId/:selectedYear?',
  authController.protect,
  viewsController.getChildren
);

router.get(
  '/courses_table/:selectedYear?/:ownerId?',
  authController.protect,
  viewsController.getCoursesTable
);
router.get(
  '/course_profile/:courseId/:selectedYear?/:ownerId?',
  authController.protect,
  viewsController.getCourseProfile
);

//---------------------------------------------for testing purposes---------------------------------------------
router.get('/news_table', authController.protect, viewsController.getNewsTable);
router.get(
  '/new_profile',
  authController.protect,
  viewsController.getNewProfile
);
router.get('/new_page', authController.protect, viewsController.getNewPage);
//---------------------------------------------for testing purposes---------------------------------------------

router.get(
  '/children_table/:parentId/:selectedYear?',
  authController.protect,
  viewsController.getChildrenTable
);
router.get(
  '/child_profile/:childId/:familyId?/:selectedYear?',
  authController.protect,
  viewsController.getChildProfile
);

router.get(
  '/enrollments_table/:selectedYear?',
  authController.protect,
  viewsController.getEnrollmentsTable
);
router.get(
  '/enrollment_profile/:parentId/:selectedYear?',
  authController.protect,
  viewsController.getEnrollmentProfile
);
router.get(
  '/enrollment_admin_profile/:enrollmentId/:familyId?',
  authController.protect,
  viewsController.getEnrollmentAdminProfile
);
router.get(
  '/enrollments_admin_family_table/:parentId/:selectedYear?',
  authController.protect,
  viewsController.getEnrollmentsAdminFamilyTable
);

router.get(
  '/payments_table/:selectedYear/:parentId?',
  authController.protect,
  viewsController.getPaymentsTable
);
router.get(
  '/payment_profile/:paymentId/:selectedYear?/:parentId?',
  authController.protect,
  viewsController.getPaymentProfile
);

router.get(
  '/classes_table/:selectedYear?',
  authController.protect,
  viewsController.getClassesTable
);
router.get(
  '/class_profile/:classId/:selectedYear?',
  authController.protect,
  viewsController.getClassProfile
);

router.get(
  '/class_fees/:selectedYear?',
  authController.protect,
  viewsController.getClassFees
);

router.get(
  '/teachers_table/:selectedYear?',
  authController.protect,
  viewsController.getTeachersTable
);

router.get(
  '/teacher_profile/:userId',
  authController.protect,
  viewsController.getTeacherProfile
);
router.get(
  '/registrations_table/:selectedYear',
  authController.protect,
  viewsController.getRegistrationsTable
);
router.get(
  '/registration_profile/:selectedYear/:registeredUserId',
  authController.protect,
  viewsController.getRegistrationProfile
);

router.get('/myProfile', authController.protect, viewsController.getMyProfile);
router.get(
  '/updatePassword',
  authController.protect,
  viewsController.updatePassword
);

router.get(
  '/years',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getYears
);

router.get(
  '/year_profile/:yearId',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getYearProfile
);
router.get(
  '/years_table',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getYearsTable
);

router.get(
  '/users/:selectedYear?',
  authController.protect,
  viewsController.getUsers
);
router.get(
  '/pw/:email',
  authController.protect,
  authController.restrictTo('sysAdmin'),
  viewsController.setAllUserPasswords
);
// router.get(
//   "/pw/:email",
//   authController.protect,
//   authController.restrictTo("sysAdmin"),
//   viewsController.setUserPassword
// );

router.get(
  '/reports/childrenByGrade/:selectedYear?',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.reportChildrenByGrade
);
router.get(
  '/reports/classListsWithEnrollmentOrder/:selectedYear?',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.reportClassListsWithEnrollmentOrder
);
router.get(
  '/reports/classLists/:selectedYear?/:teacher?',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.reportClassLists
);
router.get(
  '/class_grid/:selectedYear?',
  authController.protect,
  viewsController.getClassGrid
);
router.get(
  '/reports/courses/:selectedYear?',
  authController.protect,
  viewsController.reportCourses
);
router.get(
  '/reports/invoices/:selectedYear/:parent?',
  authController.protect,
  authController.restrictTo('admin', 'sysAdin','parent'),
  viewsController.reportInvoices
);

router.get(
  '/reports/payments/:selectedYear/:teacher?',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.reportPayments
);

router.get(
  '/reports/signUpSheet/:parentId',
  authController.protect,
  authController.restrictTo('admin', 'sysAdmin', 'parent'),
  viewsController.reportSignUpSheet
);

module.exports = router;
