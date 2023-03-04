const express = require("express");
const courseController = require("../controllers/courseController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.use(authController.protect)

router
  .route("/")
  .get(authController.restrictTo('sysAdmin', 'admin'),courseController.getAllCourses)
  .post(authController.restrictTo('sysAdmin', 'admin'),courseController.createCourse);


router
  .route("/:id")
  .get(courseController.validateOwner, courseController.getCourse)
  .patch(courseController.validateOwner, courseController.filterCourse,courseController.updateCourse)
  .delete(authController.restrictTo('sysAdmin','admin'), courseController.deleteCourse);

module.exports = router;
