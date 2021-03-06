const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const { toPlaceResponseMapper } = require("../utils/utils");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceByPlaceId = async (req, res, next) => {

  const placeId = req.params.pid;

  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  let place;

  try {
    place = await Place.findOne({ placeId: placeId });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while trying to find selected place.", 500
      )
    );
  }

  if (!place) {
    return next(
      new HttpError(
        `No place with provided place id ${placeId} found.`, 404
      )
    );
  }

  res.json(toPlaceResponseMapper(place, req.protocol, req.get("host"), req.baseUrl, fullUrl));
};

const getPlacesByUserId = async (req, res, next) => {

  const userId = req.params.uid;

  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while trying to find places for selected user.", 500
      )
    );
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError(
        `No places associated with provided user id ${userId} found.`,
        404
      )
    );
  }

  res.json({ places: places.map(place => toPlaceResponseMapper(place, req.protocol, req.get("host"), req.baseUrl, fullUrl)) });
};

const createPlace = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.errors[0];
    return next(new HttpError(msg, 400));
  }

  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  const { title, description, image, address, creator } = req.body;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(
      new HttpError(
        "There was a problem fetching the coordinates for given address.",
        500
      )
    );
  }

  const createdPlace = new Place({
    placeId: uuid(),
    title,
    description,
    address,
    location: coordinates,
    image: "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    creator
  });

  let user;

  try {
    user = await User.findOne({ userId: creator });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while trying to find the user.",
        500
      )
    );
  }

  if (!user) {
    return next(
      new HttpError(
        "Could not find user for provided id",
        404
      )
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(
        "Failed to create new place, please try again!" + err,
        500
      )
    );
  }

  res.status(201).json(toPlaceResponseMapper(createdPlace, req.protocol, req.get("host"), req.baseUrl, fullUrl));
};

const updatePlace = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.errors[0];
    return next(new HttpError(msg, 400));
  }

  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  const { title, description } = req.body;

  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findOne({ placeId: placeId });
    place.title = title;
    place.description = description;
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while trying to find selected place.",
        500
      )
    );
  }

  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while trying to update selected place.",
        500
      )
    );
  }

  res.status(200).json(toPlaceResponseMapper(place, req.protocol, req.get("host"), req.baseUrl, fullUrl));
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findOne({ placeId: placeId }).populate({ path: "creatorRelation" });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while trying to find selected place." + error,
        500
      )
    );
  }

  if (!place) {
    return next(
      new HttpError(
        `No place with provided place id ${placeId} found.`,
        404
      )
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creatorRelation.places.pull(place);
    await place.creatorRelation.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while trying to delete selected place.",
        500
      )
    );
  }

  res.status(200).json({ message: `${placeId} was deleted.` });
};



exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
