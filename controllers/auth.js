// JWT
const jwt = require("jsonwebtoken");
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

// Model
const User = require("../models/user");

// Utils
const { promisify } = require("util");
const otpTemplate = require("../utils/Templates/otp");
const mailService = require("../utils/mailer");
const validatePassword = require("../utils/ValidatePassword");

// Check if logged-in user is Admin or not
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    status: "Error",
    message: "Permission Denied!",
  });
};

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: "admin" });

    if (adminUser) {
      return res.status(500).json({
        status: "Error",
        error: "Admin is already registered!",
      });
    }

    // create if there is no admin
    const { userName, password } = req.body;

    const new_user = await User.create({
      userName,
      password,
      role: "admin",
      verified: true,
      status: "Online", // Set Status to Online assuming that registeration makes online to the user
    });

    return res.status(200).json({
      status: "Success",
      message: "Admin Created Sucessfully!",
      data: new_user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `${error.message}`,
      error: "Internal Server Error",
    });
  }
};

// Register Normal User
const register = async (req, res) => {
  const { userName, password } = req.body;

  // Check if a verified user with given userName exists
  const existing_user = await User.findOne({ userName });

  if (existing_user && existing_user.verified) {
    return res.status(400).json({
      status: "Error",
      message: "User is already verified. Please Login instead!",
    });
  } else if (existing_user) {
    return res.status(400).json({
      status: "Error",
      message:
        "You have registered, but not verfied! Please Verify with your email!",
    });
  } else {
    // Password Validation
    const { status, message } = validatePassword(password);
    if (status === "Error") {
      return res.status(400).json({
        status: status,
        message: message,
      });
    }

    // create if no user matches with the userName verified
    const new_user = await User.create({
      userName,
      password,
      role: "user",
      status: "Online",
    });

    return res.status(200).json({
      status: "Error",
      message: "Registered Successfully!",
      data: new_user,
    });
  }
};

// Send OTP
const sendOTP = async (req, res) => {
  const userId = req.user._id;
  const { email } = req.body;

  const new_otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 minutes after OTP is sent

  const otp = await bcrypt.hash(new_otp.toString(), 12);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      email,
      otp,
      otp_expiry_time,
    },
    { new: true, validateModifiedOnly: true }
  );

  // Mail Sending
  await mailService
    .sendEmail({
      from: "htetnainghein7777@gmail.com",
      to: user.email,
      subject: "Verification OTP",
      html: otpTemplate(user.userName, new_otp),
      attachments: [],
    })
    .catch((error) => {
      console.log(error);
    });

  res.status(200).json({
    status: "Success",
    message: "OTP Sent Successfully!",
  });
};

// Verify OTP
const verifyOTP = async (req, res) => {
  // verify OTP and update User record accordingly

  const userId = req.user._id;
  const { otp } = req.body;

  const user = await User.findOne({
    _id: userId,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "Error",
      message: "Email is invalid or OTP is expired!",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "Error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    return res.status(400).json({
      status: "Error",
      message: "Invalid OTP!",
    });
  }

  // OTP is correct
  user.verified = true;
  user.otp = undefined;
  user.otp_expiry_time = undefined;

  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "Success",
    message: "OTP is verified sucessfully!",
    token,
    user_id: user._id,
  });
};

// Login Validation
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        status: "error",
        message: "Both username and password are required!",
      });
    }

    const user = await User.findOne({ userName }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid username or password.",
      });
    }

    const token = signToken(user._id);

    await User.findByIdAndUpdate(user._id, { status: "Online" });

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      token,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Logout for setting offline and deleting JWT
const logout = async (req, res) => {
  try {
    // Logout must be done after login
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { status: "Offline" });

    res.clearCookie("jwt"); // Clear the JWT cookie

    res.status(200).json({
      status: "success",
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Middleware to check the token is valid or not
const protect = async (req, res, next) => {
  // Getting JWT Token and check if it's there

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    console.log(req.cookies.jwt);
    token = req.cookies.jwt;
  } else {
    return res.status(400).json({
      status: "Error",
      message: "You have to be logged in first! ",
    });
  }

  // Verfication of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const this_user = await User.findById(decoded.userId);

  if (!this_user) {
    return res.status(400).json({
      status: "error",
      message: "The user does not exist!",
    });
  }

  // Check if user changed their password after token was issued
  if (this_user.changedPasswordAfter(decoded.iat)) {
    return res.status(404).json({
      status: "Error",
      message: "User recently updated password! Please log in again!",
    });
  }

  req.user = this_user;
  next();
};

module.exports = {
  registerAdmin,
  register,
  login,
  isAdmin,
  protect,
  sendOTP,
  verifyOTP,
  logout,
};
