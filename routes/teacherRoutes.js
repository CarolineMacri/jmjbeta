const express = require("express");
const teacherController = require("../controllers/teacherController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.use(authController.protect)

router
  .route("/")
  .get(authController.restrictTo('sysAdmin', 'admin'),teacherController.getAllTeachers)
  .post(authController.restrictTo('sysAdmin', 'admin'),teacherController.createTeacher);
router
  .route("/:id")
  .get(authController.restrictTo('sysAdmin', 'admin'),teacherController.getTeacher)
  .patch(authController.restrictTo('sysAdmin', 'admin', 'teacher'), teacherController.updateTeacher)
  .delete(authController.restrictTo('sysAdmin', 'admin'),teacherController.deleteTeacher);

module.exports = router;
