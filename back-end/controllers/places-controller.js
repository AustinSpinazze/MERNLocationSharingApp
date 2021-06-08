const {v4: uuid} = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    place: {
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
    },
    creator: "u1",
  },
  {
    place: {
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
    },
    creator: "u1",
  },
];

const getPlaceByPlaceId = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((element) => {
    return element.place.id === placeId;
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

  let placesArray = new Array();
  DUMMY_PLACES.find((element) => {
    if (element.creator === userId) {
      placesArray.push(element.place);
    }
  });

  if (placesArray.length === 0) {
    return next(
      new HttpError(
        `No places associated with provided user id ${userId} found.`,
        404
      )
    );
  }

  res.json({ places: placesArray });
};

const createPlace = (req, res, next) => {
  const { title, description, imageUrl, address, coordinates, creator } =
    req.body;
  const createdPlace = {
    place: {
        id: uuid(),
      title,
      description,
      imageUrl,
      address,
      location: coordinates,
    },
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
