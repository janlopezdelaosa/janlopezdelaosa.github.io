var express = require("express");
var router = express.Router();
var db = require("./db.js");

var utils = require("./utils.js");
// router.get("/", async (req, res, next) => {
//   console.log(req.query);
//   try {
//     const dbForecast = db.ref("/forecast");

//     var retrievedData;
//     if (!req.query.location) {
//       retrievedData = await dbForecast.once("value");
//     } else {
//       const location = req.query.location;
//       console.log(location);
//       retrievedData = await dbForecast
//         .orderByChild("/locationSlug")
//         .equalTo(location)
//         .once("value");
//     }

//     const list = [];

//     retrievedData.forEach((childSnapshot) => {
//       list.push({
//         ...childSnapshot.val(),
//         id: childSnapshot.key,
//       });
//     });

//     console.log(list);

//     var startDate;
//     //var startingStr;
//     if (!req.query.date) {
//       const now = new Date();
//       const today = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate(),
//         0,
//         0,
//         0
//       );
//       startDate = today;
//       // ISO format example 2021-02-11T18:45:55.136Z
//       //startingStr = startingDate.toISOString().split("T")[0];
//     } else {
//       const startingStr = req.query.date;
//       // TODO: Check that startingStr is a correct string
//       startDate = new Date(startingStr);
//     }
//     //console.log("(str): " + startingStr); // + "\n(date): " + startingDate);

//     var finishDate = new Date(startDate);
//     var days = req.query.days ? Number(req.query.days) : 1;
//     // TODO: Check that days is a correct string
//     finishDate.setDate(finishDate.getDate() + days);
//     //var finishStr = finishDate.toISOString().split("T")[0];
//     //console.log("(str): " + finishStr); //+ "\n(date): " + finishDate);

//     const startTime = startDate.getTime();
//     const finishTime = finishDate.getTime();
//     var filteredList = list.filter((fc) => {
//       const forecastTime = new Date(fc.date).getTime();
//       //   const r1 = fcD.getTime() >= startingDate.getTime();
//       //   console.log(
//       //     "is " + fcD.getTime() + " >= " + startingDate.getTime() + " ?" + r1
//       //   );
//       //   const r2 = fcD.getTime() <= finishDate.getTime();

//       //   console.log(
//       //     "is " + fcD.getTime() + " <= " + finishDate.getTime() + " ?" + r2
//       //   );
//       return forecastTime >= startTime && forecastTime <= finishTime;
//     });

//     var filteredSnapshot = {};
//     filteredList.forEach((c) => {
//       const locationSlug = c.locationSlug;
//       const date = c.date;
//       //   const forecast = c.forecast;
//       filteredSnapshot[c.id] = { locationSlug, date };
//     });

//     res.status(200);
//     res.send(filteredSnapshot);
//   } catch (error) {
//     return next(error);
//   }
// });

router.get("/", async (req, res, next) => {
  console.log(req.query);
  try {
    const dbForecast = db.ref("/forecast");

    var retrievedData = [];
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
        //id: childSnapshot.key,
      });
    });

    console.log(list);

    var isGreaterOrEqualThanStart;
    if (!req.query.start) {
      isGreaterOrEqualThanStart = (fcT, sdT) => true;
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

    var isLessOrEqualThanEnd;
    if (!req.query.end) {
      isLessOrEqualThanEnd = (fcT, sdT) => true;
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

    var filteredList = list.filter((fc) => {
      const forecastTime = new Date(fc.date).getTime();
      return (
        isGreaterOrEqualThanStart(forecastTime) &&
        isLessOrEqualThanEnd(forecastTime)
      );
    });

    // var filteredSnapshot = {};
    // filteredList.forEach((c) => {
    //   const locationSlug = c.locationSlug;
    //   const date = c.date;
    //   //   const forecast = c.forecast;
    //   filteredSnapshot[c.id] = { locationSlug, date };
    // });

    res.status(200);
    // res.send(filteredSnapshot);
    res.send(filteredList);
  } catch (error) {
    return next(error);
  }
});

router.post("/", (req, res) => {
  console.log(req.body);

  var missingFields = [];

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
              "A location with slug " + locationSlug + " must exist in the BD",
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
                var sameSlug = false;
                var sameDate = false;
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
                      var newForecastID = dbForecast.push().key;

                      var newForecastEntry = {};
                      newForecastEntry[newForecastID] = forecastData;

                      dbForecast.update(newForecastEntry);

                      res.status(200);
                      res.send(forecastData);
                      //res.send({ ...forecastData, newForecastID });
                      console.log("insert in BD");
                    }
                  }
                }
              });
          }
        }
      });
  }
});

router.delete("/", (req, res) => {
  const dbForecast = db.ref("/forecast");

  dbForecast
    .remove()
    .then(() => {
      res.status(200);
      res.send("All forecast data deleted from /forecast");
    })
    .catch(() => {
      res.status(400);
      res.send("Forecast data couldn't be deleted from /forecast");
    });
});

module.exports = router;
