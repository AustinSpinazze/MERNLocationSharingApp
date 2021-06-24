const express = require("express");
const { check } = require("express-validator");

const placesController = require("../controllers/places-controller");

const router = express.Router();

router.get("/places/:pid", placesController.getPlaceByPlaceId);

router.get("/user/:uid", placesController.getPlacesByUserId);

router.post(
  "/places",
  [
    check("title")
      .not()
      .isEmpty()
      .withMessage("Title field must not be empty."),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Description field must be at least 5 characters long."),
    check("address")
      .not()
      .isEmpty()
      .withMessage("Address field must not be empty."),
  ],
  placesController.createPlace
);

router.patch(
  "/places/:pid",
  [
    check("title")
      .not()
      .isEmpty()
      .withMessage("Title field must not be empty."),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Description field must be at least 5 characters long."),
  ],
  placesController.updatePlace
);

router.delete("/places/:pid", placesController.deletePlace);

module.exports = router;
