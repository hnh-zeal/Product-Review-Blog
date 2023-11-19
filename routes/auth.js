const router = require("express").Router();

const {
  login,
  logout,
  protect,
  register,
  registerAdmin,
  sendOTP,
  verifyOTP,
} = require("../controllers/auth");

router.post("/register-admin", registerAdmin);
router.post("/register", register);
router.post("/verify", protect, verifyOTP);
router.post("/send-otp", protect, sendOTP);
router.post("/login", login);
router.post("/logout", protect, logout);

module.exports = router;
