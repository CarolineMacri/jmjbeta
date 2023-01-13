const express = require("express");
const childController = require("../controllers/childController");

//ROUTES
const router = express.Router();

router
  .route("/")
  .get(childController.getAllChildren)
  .post(childController.createChild);
router
  .route("/:id")
  .get(childController.getChild)
  .patch(childController.updateChild)
  .delete(childController.deleteChild);

module.exports = router;
