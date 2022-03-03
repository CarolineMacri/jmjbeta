const express = require('express');
const yearController = require('../controllers/yearController');

//ROUTES

const router = express.Router();
router
  .route('/')
  .get(yearController.getAllYears)
  .post(yearController.createYear);
router
  .route('/:id')
  .get(yearController.getYear)
  .patch(yearController.updateYear)
  .delete(yearController.deleteYear);

module.exports = router; 
