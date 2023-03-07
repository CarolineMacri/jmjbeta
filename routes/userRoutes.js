const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

//ROUTES
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updateMe", userController.updateMe);
router.patch("/updateMyPassword", authController.updatePassword);

router.post("/emailRegistrationVerification/:id", userController.emailRegistrationVerification);

router.use(authController.restrictTo("admin", "sysAdmin"));

router.patch("/adminResetPassword/:id", authController.adminResetPassword);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get( userController.getUser)
  .patch( userController.updateUser)
  .delete( userController.deleteUser);

module.exports = router;
