const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getUserProfile = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

const updateProfile = async (req, res) => {
  // user object will be passed from protect middleware
  const { user } = req;

  const updateFields = req.body;

  // Check if the password field is present in the updateFields
  if ("password" in updateFields) {
    // Hash the password if present
    updateFields.password = await bcrypt.hash(updateFields.password, 12);
  }

  const updated_user = await User.findOneAndUpdate(user._id, updateFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    data: updated_user,
    message: "Profile Updated Successfully!",
  });
};

module.exports = { getUserProfile, updateProfile };
