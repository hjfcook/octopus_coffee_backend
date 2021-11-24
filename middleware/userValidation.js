const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = async function userValidation(req, res, next) {
  const errors = {};
  const userObject = {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    password: undefined,
  };

  const firstName = req.body.firstName;
  if (!firstName) {
    errors.firstName = "A first name must be supplied";
  } else if (typeof firstName !== "string") {
    errors.firstName = "The supplied name must be a string";
  } else if (firstName.length > 20) {
    errors.firstName = "The supplied name must be <= 20 characters long";
  } else if (firstName.match(/[^\p{L} -]+/u)) {
    errors.firstName = "The supplied name contains invalid characters";
  } else {
    const titleCaseName = firstName
      // .toLowerCase()
      .replace(/ +(?= )/g, "")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    userObject.firstName = titleCaseName;
  }

  const lastName = req.body.lastName;
  if (!lastName) {
    errors.lastName = "A last name must be supplied";
  } else if (typeof lastName !== "string") {
    errors.lastName = "The supplied name must be a string";
  } else if (lastName.length > 20) {
    errors.lastName = "The supplied name must be <= 20 characters long";
  } else if (lastName.match(/[^\p{L} -]+/u)) {
    errors.lastName = "The supplied name contains invalid characters";
  } else {
    const titleCaseName = lastName
      // .toLowerCase()
      .replace(/ +(?= )/g, "")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    userObject.lastName = titleCaseName;
  }

  const email = req.body.email;
  if (!email) {
    errors.email = "An email address must be supplied";
  } else if (typeof email !== "string") {
    errors.email = "The supplied email address must be a string";
  } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = "The supplied email address must be valid";
  } else {
    const lowerCaseEmail = email.toLowerCase();
    if (req.method === "POST") {
      try {
        const doc = await User.findOne({ email: lowerCaseEmail }).exec();
        if (doc) {
          errors.email =
            "The supplied email address has already been registered";
        } else {
          userObject.email = lowerCaseEmail;
        }
      } catch (err) {
        throw err;
      }
    } else {
      userObject.email = lowerCaseEmail;
    }
  }

  const password = req.body.password;
  if (req.method === "POST") {
    if (!password) {
      errors.password = "A password must be supplied";
    } else if (typeof password !== "string") {
      errors.password = "The supplied password must be a string";
    } else if (password.length < 8) {
      errors.password = "The supplied password must be >= 8 characters long";
    } else {
      userObject.password = await bcrypt.hash(password, 10);
    }
  }

  console.log(req.body);
  const admin = req.body.admin;
  if (req.method === "PUT") {
    if (typeof admin === "undefined") {
      errors.admin = "Admin status must be supplied";
    } else if (typeof admin !== "boolean") {
      errors.password = "Admin status must be true or false";
    } else {
      userObject.admin = admin;
    }
  }

  if (Object.keys(errors).length === 0) {
    req.userObject = userObject;
    next();
  } else {
    res.status(400).send({
      status: "fail",
      data: errors,
    });
  }
};
