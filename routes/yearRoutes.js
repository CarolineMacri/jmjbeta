const express = require("express");
const yearController = require("../controllers/yearController");
const authController = require("../controllers/authController");

//ROUTES

const router = express.Router();

router.use(authController.protect)
router.use(authController.restrictTo('sysAdmin', 'admin'))

router
  .route("/")
  .get(yearController.getAllYears)
  .post(yearController.createYear);
router
  .route("/:id")
  .get(yearController.getYear)
  .patch(yearController.updateYear)
  .delete(yearController.deleteYear);

module.exports = router;
