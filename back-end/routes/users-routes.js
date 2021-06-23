const express = require("express");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/users", usersController.getUsers);

router.post("/users/signup", usersController.signUp);

router.post("/users/login", usersController.login);

module.exports = router;
