const validatePassword = (password) => {
  var minNumberofChars = 8;
  var maxNumberofChars = 16;
  var regularExpression =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
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
        "Password must contain atleast one number and one special character!",
    };
  }
  return {
    status: "Success",
    message: "Password is okay!"
  };
};

module.exports = validatePassword;
