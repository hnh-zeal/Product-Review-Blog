const Product = require("../models/product");

// Create Product By Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, currency } = req.body;
    const product = await Product.create({
      name,
      description,
      category,
      price,
      currency,
    });

    return res.status(200).json({
      status: "success",
      message: "Product Created Successfully!",
      data: {
        product: product,
      },
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: `${error}`,
    });
  }
};

// Update Product by Id
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateFields = req.body;

    // Update only the specified fields
    const product = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }, // This option returns the updated document
      { validateModifyOnly: true }
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product Updated Successfully!",
      data: {
        product: product,
      },
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: `${error}`,
    });
  }
};

// Get Specific Product by Id
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch the product from the database by ID
    const product = await Product.findById(productId);

    if (!product) {
      // If the product with the given ID is not found, return a 404 Not Found response
      return res.status(404).json({
        status: "error",
        error: "Product is not found",
      });
    }

    // If the product is found, return its details in the response
    res.status(200).json({
      status: "success",
      data: {
        product: product,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
};

// Delete Product by Id
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    console.log(productId);
    // Fetch the product from the database by ID
    const product = await Product.findById(productId);

    if (!product) {
      // If the product with the given ID is not found, return a 404 Not Found response
      return res.status(404).json({
        status: "error",
        error: "Product is not found",
      });
    }

    // Perform the deletion
    await Product.findByIdAndDelete(productId);

    // If the product is successfully deleted, return a success response
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
};

// Get All Products by Pagination
const getAllProducts = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 5; // Number of products per page
    const page = parseInt(req.query.page) || 1; // Current page

    // Calculate the skip value based on perPage and page
    const skip = (page - 1) * perPage;

    // Fetch products from the database with pagination and sorting by name
    const products = await Product.find()
      .sort({ name: 1 }) // 1 for ASC order, -1 for DSC order
      .skip(skip)
      .limit(perPage);

    return res.status(200).json({
      status: "success",
      message: "Fetched All Products",
      data: {
        products: products,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: `${error}`,
    });
  }
};

// Get Recommended Products for users
const getRecommendedProducts = async (req, res) => {
  try {
    // Find products sorted by overall_rating in DSC order
    const recommendedProducts = await Product.find()
      .sort({ overall_rating: -1, name: 1 })
      .limit(5);

    res.status(200).json({
      status: "success",
      msg: "Fetched Recommended Products",
      data: {
        recommendedProducts,
      },
    });
  } catch (error) {
    //   console.error(error);
    res.status(500).json({
      status: "error",
      msg: "Internal Server Error",
      error: `${error}`,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  getAllProducts,
  getRecommendedProducts,
};
