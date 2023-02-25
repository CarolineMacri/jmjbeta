const express = require("express");
const childController = require("../controllers/childController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router
  .route("/")
  .get(childController.getAllChildren)
  .post(childController.validateParent,childController.createChild);
router
  .route("/:id")
  .get(authController.protect,childController.validateParent,childController.getChild)
  .patch(authController.protect,childController.validateParent, childController.updateChild)
  .delete(authController.protect,childController.validateParent,childController.deleteChild);

module.exports = router;
