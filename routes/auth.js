const router = require("express").Router();

const {
  login,
  logout,
  protect,
  register,
  registerAdmin,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/register-admin", registerAdmin);
router.post("/register", register);
router.post("/verify", verifyOTP);
router.post("/send-otp", sendOTP);
router.post("/login", login);
router.post("/logout", protect, logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
