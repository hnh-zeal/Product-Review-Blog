const Review = require("../models/review");

const calculateOverallRating = async (reviews) => {
  // Fetch reviews from the database based on the ObjectIds in product.reviews
  const reviewObjects = await Review.find({ _id: { $in: reviews } });

  // Calculate the sum of ratings
  const totalRating = reviewObjects.reduce((sum, review) => {
    const rating = parseFloat(review.rating);
    return !isNaN(rating) ? sum + rating : sum;
  }, 0);

  return totalRating / reviewObjects.length;
};

module.exports = calculateOverallRating;
