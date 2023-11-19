const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Product Name is required!"],
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: String,
    quantityInStock: {
      type: Number,
      default: 0,
    },
    overall_rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

// Constraints for Unique Name
productSchema.plugin(uniqueValidator, {
  message: "[Product Name: '{VALUE}'] must be unique.",
});

module.exports = mongoose.model("Product", productSchema);
