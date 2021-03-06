const express = require('express');
const viewsController = require('../controllers/viewsController/index');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getHome);
router.get('/login', viewsController.getLogin); 
router.get('/resetPassword/:resetPasswordToken', viewsController.getResetPassword);

router.use(authController.isLoggedIn);

router.get('/families/:selectedYear?',  authController.protect, authController.restrictTo('admin'),viewsController.getFamilies);
router.get('/family/:parentId/:selectedYear?', authController.protect, viewsController.getFamily);
router.get('/children/:parentId/:selectedYear?', authController.protect, viewsController.getChildren);

router.get('/courses_table/:selectedYear?/:ownerId?', authController.protect, viewsController.getCoursesTable);
router.get('/course_profile/:courseId/:selectedYear?/:ownerId?', authController.protect, viewsController.getCourseProfile);

router.get('/enrollments_table/:selectedYear?', authController.protect, viewsController.getEnrollmentsTable);
router.get('/enrollment_profile/:parentId/:selectedYear?', authController.protect, viewsController.getEnrollmentProfile);

router.get('/classes_table/:selectedYear?', authController.protect, viewsController.getClassesTable);
router.get('/class_profile/:classId/:selectedYear?', authController.protect, viewsController.getClassProfile);
router.get('/class_grid/:selectedYear?', authController.protect, viewsController.getClassGrid);
router.get('/class_fees/:selectedYear?', authController.protect, viewsController.getClassFees);

router.get('/teachers/:selectedYear?', authController.protect, viewsController.getTeachers);
router.get('/registrations/:selectedYear?', authController.protect, viewsController.getRegistrations);

router.get('/myProfile', authController.protect, viewsController.getMyProfile);
router.get('/updatePassword', authController.protect, viewsController.updatePassword);

router.get('/years', viewsController.getYears);

router.get('/users/:selectedYear?', authController.protect, viewsController.getUsers);
router.get('/pw', authController.protect, authController.restrictTo('admin'),viewsController.setAllUserPasswords);

router.get('/reports/childrenByGrade/:selectedYear?', authController.protect, authController.restrictTo('admin'), viewsController.reportChildrenByGrade);
router.get('/reports/classLists/:selectedYear?/:teacher?', authController.protect, authController.restrictTo('admin'), viewsController.reportClassLists);
 
module.exports = router; 