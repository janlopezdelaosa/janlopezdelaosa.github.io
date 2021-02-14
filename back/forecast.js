const express = require("express");
const router = express.Router();
const db = require("./db.js");

const utils = require("./utils.js");

router.get("/", async (req, res, next) => {
  try {
    const dbForecast = db.ref("/forecast");

    let retrievedData = [];
    if (!req.query.location) {
      retrievedData = await dbForecast.once("value");
    } else {
      const location = req.query.location;
      const dbLocations = db.ref("/locations");
      const snapshot = await dbLocations
        .orderByChild("slug")
        .equalTo(location)
        .once("value");

      if (!snapshot.exists()) {
        res.status(400);
        res.send({
          msg: "A location with slug " + location + " must exist in the BD",
        });
      } else {
        retrievedData = await dbForecast
          .orderByChild("/locationSlug")
          .equalTo(location)
          .once("value");
      }
    }

    const list = [];

    retrievedData.forEach((childSnapshot) => {
      list.push({
        ...childSnapshot.val(),
      });
    });

    let isGreaterOrEqualThanStart;
    if (!req.query.start) {
      isGreaterOrEqualThanStart = () => true;
    } else {
      const startStr = req.query.start;
      const startDate = new Date(startStr);
      const startTime = startDate.getTime();
      if (!utils.isValidDate(startStr) || isNaN(startTime)) {
        res.status(400);
        res.send({
          msg: startStr + " is not a valid date, use yyyy-mm-dd format",
        });
      } else {
        isGreaterOrEqualThanStart = (fcT) => fcT >= startTime;
      }
    }

    let isLessOrEqualThanEnd;
    if (!req.query.end) {
      isLessOrEqualThanEnd = () => true;
    } else {
      const endStr = req.query.end;
      const endDate = new Date(endStr);
      const endTime = endDate.getTime();
      if (!utils.isValidDate(endStr) || isNaN(endTime)) {
        res.status(400);
        res.send({
          msg: endStr + " is not a valid date, use yyyy-mm-dd format",
        });
      } else {
        isLessOrEqualThanEnd = (fcT) => fcT <= endTime;
      }
    }

    const filteredList = list.filter((fc) => {
      const forecastTime = new Date(fc.date).getTime();
      return (
        isGreaterOrEqualThanStart(forecastTime) &&
        isLessOrEqualThanEnd(forecastTime)
      );
    });

    res.status(200);
    res.send(filteredList);
  } catch (error) {
    return next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    let missingFields = [];

    const locationSlug = req.body.locationSlug;
    if (!locationSlug) {
      missingFields.push("locationSlug");
    }

    const date = req.body.date;
    if (!date) {
      missingFields.push("date");
    }

    const hourly = req.body.hourly;
    if (!hourly) {
      missingFields.push("hourly");
    }

    if (missingFields.length > 0) {
      res.status(400);
      res.send({ msg: missingFields.toString() + " fields missing" });
    } else {
      const forecastData = {
        locationSlug,
        date,
        hourly,
      };

      const dbLocations = db.ref("/locations");

      dbLocations
        .orderByChild("slug")
        .equalTo(locationSlug)
        .once("value", (snapshot) => {
          if (!snapshot.exists()) {
            res.status(400);
            res.send({
              msg:
                "A location with slug " +
                locationSlug +
                " must exist in the BD",
            });
          } else {
            const dateStr = date;
            const dateDate = new Date(dateStr);
            const dateTime = dateDate.getTime();
            if (!utils.isValidDate(dateStr) || isNaN(dateTime)) {
              res.status(400);
              res.send({
                msg: dateStr + " is not a valid date, use yyyy-mm-dd format",
              });
            } else {
              const dbForecast = db.ref("/forecast");

              dbForecast
                .orderByChild("locationSlug")
                .equalTo(locationSlug)
                .once("value", (snapshot) => {
                  let sameSlug = false;
                  let sameDate = false;
                  if (snapshot.exists()) {
                    sameSlug = true;
                    snapshot.forEach((childSnapshot) => {
                      const childData = childSnapshot.val();
                      sameDate = sameDate || childData.date === date;
                    });
                  }

                  if (sameSlug && sameDate) {
                    res.status(400);
                    res.send({
                      msg:
                        "A forecast for " +
                        locationSlug +
                        ", " +
                        date +
                        " already exists in the BD",
                    });
                  } else {
                    if (!Array.isArray(hourly)) {
                      res.status(400);
                      res.send({
                        msg: "Field hourly must be an array",
                      });
                    } else if (hourly.length !== 24) {
                      res.status(400);
                      res.send({
                        msg:
                          "Field hourly has " +
                          hourly.length +
                          " items but must have 24",
                      });
                    } else {
                      const allItemsAreNumber = hourly.reduce(
                        (prev, curr, idx) => prev && !isNaN(curr),
                        true
                      );

                      if (!allItemsAreNumber) {
                        res.status(400);
                        res.send({
                          msg: "All forecast items must be a number",
                        });
                      } else {
                        const newForecastID = dbForecast.push().key;

                        let newForecastEntry = {};
                        newForecastEntry[newForecastID] = forecastData;

                        dbForecast.update(newForecastEntry);

                        res.status(201);
                        res.send(forecastData);
                      }
                    }
                  }
                });
            }
          }
        });
    }
  } catch (error) {
    return next(error);
  }
});

router.delete("/", (req, res, next) => {
  try {
    const dbForecast = db.ref("/forecast");

    dbForecast.remove().then(() => {
      res.status(200);
      res.send("All forecast data deleted from /forecast");
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
