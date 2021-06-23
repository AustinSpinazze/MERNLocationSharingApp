const express = require("express");

const placesController = require("../controllers/places-controller");

const router = express.Router();

router.get("/places/:pid", placesController.getPlaceByPlaceId);

router.get("/user/:uid", placesController.getPlacesByUserId);

router.post("/places", placesController.createPlace);

router.patch("/places/:pid", placesController.updatePlace);

router.delete("/places/:pid", placesController.deletePlace);

module.exports = router;
