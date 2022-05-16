const Validator = require("validator");
const isEmpty = require("is-empty");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.user = "Username must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.username)) {
    errors.user = "Name field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.user = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.user = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.user = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.user = "Password must be between 6 to 30 characters";
  }

  if (data.password !== data.cpassword) {
    errors.user = "Passwords must be same";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
