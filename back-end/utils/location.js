const axios = require("axios");
const dotenv = require("dotenv");

const HttpError = require("../models/http-error");

dotenv.config();

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      address
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );

  if (!response.data || response.data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for given address.",
      404
    );
    throw error;
  }

  return response.data.results[0].geometry.location;
}

module.exports = getCoordsForAddress;
