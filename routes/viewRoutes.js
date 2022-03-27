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
router.get('/courses_table/:selectedYear?', authController.protect, viewsController.getCoursesTable);
router.get('/course_profile/:courseId/:selectedYear?', authController.protect, viewsController.getCourseProfile);
router.get('/teachers/:selectedYear?', authController.protect, viewsController.getTeachers);
router.get('/registrations/:selectedYear?', authController.protect, viewsController.getRegistrations);

router.get('/myProfile', authController.protect, viewsController.getMyProfile);
router.get('/updatePassword', authController.protect, viewsController.updatePassword);

router.get('/years', viewsController.getYears);
router.get('/users/:selectedYear?', viewsController.getUsers);
router.get('/pw', authController.protect, authController.restrictTo('admin'),viewsController.setAllUserPasswords);

router.get('/reports/childrenByGrade/:selectedYear?', authController.protect, authController.restrictTo('admin'), viewsController.reportChildrenByGrade);
 
module.exports = router; 