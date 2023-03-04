const express = require("express");
const teacherController = require("../controllers/teacherController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.use(authController.protect)
router.use(authController.restrictTo('sysAdmin', 'admin', 'teacher'))

router
  .route("/")
  .get(teacherController.getAllTeachers)
  .post(teacherController.createTeacher);
router
  .route("/:id")
  .get(teacherController.getTeacher)
  .patch(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;
