const express = require("express");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(express.json());

app.use("/api", placesRoutes);
app.use("/api", userRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    next(error)
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
        .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
    .connect(process.env.MONGO_DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        app.listen(5000);
    })
    .catch(error => {
        console.log(error)
    });