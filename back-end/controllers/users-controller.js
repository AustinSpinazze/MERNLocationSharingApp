const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const { toUserResponseMapper } = require("../utils/utils");

const getUsers = async (req, res, next) => {

  const protocol = req.protocol;

  const host = req.get("host");

  let user;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError(
        "Could not retrieve users, please try again later", 500
      )
    );
  }

  res.json({ users: users.map(user => toUserResponseMapper(user, protocol, host)) });
};

const signUp = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.errors[0];
    return next(new HttpError(msg, 400));
  }

  const { name, username, email, password, image, places } = req.body;

  const protocol = req.protocol;

  const host = req.get("host");

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError(
        "Signup failed please try again later", 500
      )
    );
  }

  if (existingUser) {
    return next(
      new HttpError(
        "Could not create user, email already in use.", 409
      )
    );
  }

  const createdUser = new User({
    userId: uuid(),
    name,
    email,
    image: "https://austinspinazze.dev/public/images/profile.jpeg",
    username,
    password,
    places
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(
      new HttpError(
        (error ? error : "There was problem creating your account, please try again later."), (error ? 400 : 500)
      )
    );
  }

  res.status(201).json({ user: toUserResponseMapper(createdUser, protocol, host) });
};

const login = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.errors[0];
    return next(new HttpError(msg, 400));
  }

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError(
        "Login failed please try again later", 500
      )
    );
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        "Could not login, please check your credentials", 401
      )
    );
  }

  return res.json({ message: "Logged In!" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
