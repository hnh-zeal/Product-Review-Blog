const Product = require("../models/product");
const Review = require("../models/review");
const calculateOverallRating = require("../utils/CalculateRating");

// Get Reviews on the Product
const getReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Search the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "Error",
        message: "Product is not found",
      });
    }

    const reviews = await Review.find({ _id: {$in: product.reviews}}).populate("user product");

    res.status(200).json({
      status: "success",
      data: {
        reviews: reviews || [],
      },
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
};

// Post Review on the Product
const postReview = async (req, res) => {
  try {
    if (req.user.verified === false) {
      return res.status(404).json({
        status: "Error",
        message: "You are not verified yet!",
      });
    }

    const productId = req.params.productId;

    const { rating, comment } = req.body;

    // Search the product
    const product = await Product.findById(productId).populate("reviews");
    if (!product) {
      return res.status(404).json({
        status: "Error",
        message: "Product is not found",
      });
    }

    // Check Review is already created or not
    const review = await Review.findOne({
      user: req.user._id,
      product: product._id,
    });

    if (review) {
      return res.status(409).json({
        status: "Error",
        message: "Review has already been posted for this product by the user",
      });
    }

    // Create a new review
    const newReview = await Review.create({
      user: req.user._id,
      product: product._id,
      rating,
      comment,
    });

    product.reviews.push(newReview);
    product.overall_rating = await calculateOverallRating(product.reviews);
    await product.save();

    res.status(201).json({
      status: "success",
      data: {
        product: product,
        review: newReview,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
};

// Update Review on the Product
const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const updatedFields = req.body;

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "Error",
        message: "Product is not found",
      });
    }

    // Find the review in the reviews array
    const productReview = await product.reviews.find((review) => {
      return review._id.toString() === reviewId;
    });

    if (!productReview) {
      res.status(404).json({
        status: "error",
        message: "Review is not found in the Product",
      });
    }

    const review = await Review.findById(productReview);

    // Check Access Right and Update
    if (
      req.user.role === "admin" ||
      review.user._id.toString() === req.user._id.toString()
    ) {
      // Use the $set operator to update fields
      const updatedReview = await Review.findByIdAndUpdate(
        review._id,
        updatedFields,
        { new: true }
      );

      // Check if 'rating' is updated and update the overall_rating
      if ("rating" in updatedFields) {
        product.overall_rating = await calculateOverallRating(product.reviews);
        await product.save();
      }

      const updatedProduct = await Product.findById(product._id).populate("reviews");

      res.status(200).json({
        status: "success",
        data: {
          product: updatedProduct,
          review: updatedReview,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "You cannot update the Review",
      });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
};

// Delete Review, managed by Admin
const deleteReview = async (req, res) => {
  const { productId, reviewId } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "Error",
        message: "Product is not found",
      });
    }

    // Find the index of the review in the reviews array
    const reviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex !== -1) {
      // Remove the review from the product
      product.reviews.splice(reviewIndex, 1);
      product.overall_rating = await calculateOverallRating(product.reviews);
      await product.save();

      res.status(200).json({
        status: "success",
        data: {
          message: "Review deleted successfully",
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Review is not found",
      });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = { getReviews, postReview, updateReview, deleteReview };
