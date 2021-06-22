const express = require("express");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/places/:pid", placesControllers.getPlaceByPlaceId);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post("/places", placesControllers.createPlace);

router.patch("/places/:pid", placesControllers.updatePlace);

router.delete("/places/:pid", placesControllers.deletePlace);

module.exports = router;
