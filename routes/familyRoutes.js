const express = require("express");
const familyController = require("../controllers/familyController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.use(authController.protect)
router.use(authController.restrictTo('sysAdmin', 'admin'))

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
