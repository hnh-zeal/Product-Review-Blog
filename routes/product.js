const router = require("express").Router();

const { isAdmin, protect } = require("../controllers/auth");
const {
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  getAllProducts,
  getRecommendedProducts,
} = require("../controllers/product");
const {
  getReviews,
  postReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");

// Product routes
router.get("/", getAllProducts);
router.get("/recommended", getRecommendedProducts);
router.get("/:id", getProductById);
router.post("/", protect, isAdmin, createProduct);
router.patch("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

// Review routes
router.get("/:productId/reviews", getReviews);
router.post("/:productId/reviews", protect, postReview);
router.patch("/:productId/reviews/:reviewId", protect, updateReview);
router.delete("/:productId/reviews/:reviewId", protect, isAdmin, deleteReview);

module.exports = router;
