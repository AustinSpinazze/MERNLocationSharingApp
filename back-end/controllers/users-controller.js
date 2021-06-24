const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Austin Spinazze",
    userName: "ShadowPrice",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { msg } = errors.errors[0];
    throw new HttpError(msg, 400);
  }

  const { name, userName, email, password } = req.body;

  const userExists = DUMMY_USERS.find((user) => user.email === email);

  if (userExists) {
    throw new HttpError("Could not create user, email already in use.", 409);
  }

  const createdUser = {
    id: uuid(),
    name,
    userName,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Invalid username or password.", 401);
  }

  return res.json({ message: "Authorized" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
