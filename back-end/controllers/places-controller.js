const { v4: uuid } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://www.nycinsiderguide.com/wp-content/uploads/2018/12/empire-state-building-nyc.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484,
      lng: -73.9857,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://www.nycinsiderguide.com/wp-content/uploads/2018/12/empire-state-building-nyc.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484,
      lng: -73.9857,
    },
    creator: "u1",
  },
];

const getPlaceByPlaceId = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((element) => {
    return element.id === placeId;
  });

  if (!place) {
    return next(
      new HttpError(`No place with provided place id ${placeId} found.`, 404)
    );
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError(
        `No places associated with provided user id ${userId} found.`,
        404
      )
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, imageUrl, address, coordinates, creator } =
    req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    imageUrl,
    address,
    location: coordinates,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const place = {
    ...DUMMY_PLACES.find((element) => element.id === placeId),
  };
  const placeIndex = DUMMY_PLACES.findIndex(
    (element) => element.id === placeId
  );

  place.title = title;
  place.description = description;

  DUMMY_PLACES[placeIndex] = place;

  res.status(200).json({ place });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({message: `${placeId} was deleted.`});


};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
