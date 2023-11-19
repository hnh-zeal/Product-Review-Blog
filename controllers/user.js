const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validatePassword = require("../utils/ValidatePassword");

const getUserProfile = async (req, res) => {
  return res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

const updateProfile = async (req, res) => {
  try {
    // user object will be passed from protect middleware
    const { user } = req;

    const updateFields = req.body;

    // Check if the password field is present in the updateFields
    if ("password" in updateFields) {
      const { status, message } = validatePassword(updateFields.password);
      if (status === "Error") {
        return res.status(400).json({
          status: status,
          message: message,
        });
      }

      // Hash the password if present
      updateFields.password = await bcrypt.hash(updateFields.password, 12);

      // Set passwordChangedAt in the updateFields
      updateFields.passwordChangedAt = Date.now();
    }

    const updated_user = await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: updated_user,
      message: "Profile Updated Successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = { getUserProfile, updateProfile };
