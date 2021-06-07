const express = require("express");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/places/:pid", placesControllers.getPlaceByPlaceId);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

module.exports = router;
// // How to insert user id
// app.get("/api/places/user/", () => {});

// // How to insert place id
// app.get("/api/places", () => {});

// app.post("/api/places", () => {});

// // How to insert place id
// app.patch("/api/places/", () => {});

// // How to insert place id
// app.delete("/api/users/", () => {});
