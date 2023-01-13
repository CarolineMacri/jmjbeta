const express = require("express");
const familyController = require("../controllers/familyController");

//ROUTES
const router = express.Router();

router
  .route("/")
  .get(familyController.getAllFamilies)
  .post(familyController.createFamily);
router
  .route("/:id")
  .get(familyController.getFamily)
  .patch(familyController.updateFamily)
  .delete(familyController.deleteFamily);

module.exports = router;
