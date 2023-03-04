const express = require("express");
const enrollmentController = require("../controllers/enrollmentController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.use(authController.protect)
router.use(authController.restrictTo('sysAdmin', 'admin'))

router
  .route("/")
  .get(enrollmentController.getAllEnrollments)
  .post(enrollmentController.createEnrollment);
router
  .route("/:id")
  .get(enrollmentController.getEnrollment)
  .patch(enrollmentController.updateEnrollment)
  .delete(enrollmentController.deleteEnrollment);

module.exports = router;
