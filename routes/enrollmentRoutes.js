const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');

//ROUTES
const router = express.Router();

router
  .route('/')
  .get(enrollmentController.getAllEnrollments)
  .post(enrollmentController.createEnrollment);
router
  .route('/:id')
  .get(enrollmentController.getEnrollment)
  .patch(enrollmentController.updateEnrollment)
  .delete(enrollmentController.deleteEnrollment);

module.exports = router;
