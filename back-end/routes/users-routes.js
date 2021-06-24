const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/users", usersController.getUsers);

router.post(
  "/users/signup",
  [
    check("name").not().isEmpty().withMessage("Name field must not be empty."),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Please enter a valid email address."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Please enter a password at least 6 characters long."),
    check("userName")
      .isLength({ min: 5 })
      .withMessage("Please enter a username at least 5 characters long."),
  ],
  usersController.signUp
);

router.post("/users/login", usersController.login);

module.exports = router;
