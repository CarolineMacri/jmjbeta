const express = require('express');
const teacherCourseController = require('../controllers/teachercourseController');

//ROUTES
const router = express.Router();

router
  .route('/')
  .get(teacherCourseController.getAllTeacherCourses)
  .post(teacherCourseController.createTeacherCourse);
router
  .route('/:id')
  .get(teacherCourseController.getTeacherCourse)
  .patch(teacherCourseController.updateTeacherCourse)
  .delete(teacherCourseController.deleteTeacherCourse);

module.exports = router; 