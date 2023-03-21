const express = require("express");
const enrollmentController = require("../controllers/enrollmentController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.use(authController.protect)
//router.use(authController.restrictTo('sysAdmin', 'admin'))

router
  .route("/")
  .get(authController.restrictTo('sysAdmin', 'admin'), enrollmentController.getAllEnrollments)
  .post(
    authController.restrictTo('sysAdmin', 'admin', 'parent'),
    enrollmentController.validateParentOfEnrollment,
    enrollmentController.createEnrollment);
router
  .route("/:id")
  .get(authController.restrictTo('sysAdmin', 'admin'), enrollmentController.getEnrollment)
  .patch(
    authController.restrictTo('sysAdmin', 'admin', 'parent'),
    enrollmentController.validateParentOfEnrollment,
    enrollmentController.updateEnrollment)
  .delete(
    authController.restrictTo('sysAdmin', 'admin', 'parent'),
    enrollmentController.validateParentOfEnrollment,
    enrollmentController.deleteEnrollment);

module.exports = router;
