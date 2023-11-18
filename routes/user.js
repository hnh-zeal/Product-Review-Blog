const router = require("express").Router();

const { protect } = require("../controllers/auth");
const { getUserProfile, updateProfile } = require("../controllers/user");

router.get("/get-profile", protect, getUserProfile);
router.patch("/update-profile", protect, updateProfile);

module.exports = router;
