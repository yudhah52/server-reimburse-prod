const router = require("express").Router();
const userController = require("../controllers/userController");
const authLogin = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/base64");

router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.post("/get-profile", authLogin, userController.getProfile);
router.post("/edit-profile", authLogin, uploadImage, userController.editUser);
router.post(
  "/get-user-verification",
  authLogin,
  userController.getVerificationAccount
);
router.post(
  "/verification-account",
  authLogin,
  userController.verificationAccount
);

module.exports = router;
