const express = require("express");
const foodController = require("../controllers/foodController");

//ROUTES
const router = express.Router();

router
  .route("/")
  .get(foodController.getAllFoods)
  .post(foodController.createFood);
router
  .route("/:id")
  .get(foodController.getFood)
  .patch(foodController.updateFood)
  .delete(foodController.deleteFood);

module.exports = router;
