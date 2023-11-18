const router = require("express").Router();

const authRoute = require("./auth");
const userRoute = require("./user");
const productRoute = require("./product");

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/products", productRoute);

module.exports = router;