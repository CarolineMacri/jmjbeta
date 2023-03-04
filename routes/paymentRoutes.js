const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.use(authController.protect)
router.use(authController.restrictTo('sysAdmin', 'admin'))

router
  .route("/")
  .get(paymentController.getAllPayments)
  .post(paymentController.createPayment);
router
  .route("/:id")
  .get(paymentController.getPayment)
  .patch(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

module.exports = router;
