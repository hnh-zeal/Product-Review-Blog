const validatePassword = (password) => {
  var minNumberofChars = 8;
  var maxNumberofChars = 16;
  var regularExpression =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (
    password.length < minNumberofChars ||
    password.length > maxNumberofChars
  ) {
    return {
      status: "Error",
      message:
        "Password needs to be at least 8 characters and maximum 16 characters!",
    };
  }
  if (!regularExpression.test(password)) {
    return {
      status: "Error",
      message:
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
    };
  }
  return {
    status: "Success",
    message: "Password is okay!",
  };
};

module.exports = validatePassword;
