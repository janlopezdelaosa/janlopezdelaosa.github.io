var express = require("express");
var router = express.Router();
var db = require("./db.js");

router.get("/", (req, res) => {
  const dbForecast = db.ref("/forecast");
  dbForecast.once("value", (snapshot) => {
    res.status(200);

    const list = [];
    snapshot.forEach((childSnapshot) => {
      list.push({
        ...childSnapshot.val(),
        max: childSnapshot.key,
      });
    });

    console.log(list);

    res.send(snapshot.val());
  });
});

router.post("/", (req, res) => {
  console.log(req.body);

  var missingFields = [];

  const cityId = req.body.cityId;
  if (!cityId) {
    missingFields.push("cityId");
  }

  const date = req.body.date;
  if (!date) {
    missingFields.push("date");
  }

  const forecast = req.body.forecast;
  if (!forecast) {
    missingFields.push("forecast");
  }

  if (missingFields.length > 0) {
    res.status(400);
    res.send({ msg: missingFields.toString() + " fields missing" });
  } else {
    const ForecastData = {
      cityId,
      date,
      forecast,
    };

    const dbForecast = db.ref("/forecast");

    dbForecast
      .orderByChild("cityId")
      .equalTo(cityId)
      .once("value", (snapshot) => {
        var sameCity = false;
        var sameDate = false;
        if (snapshot.exists()) {
          sameCity = true;
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            sameDate = sameDate || childData.date === date;
          });
        }

        if (sameCity && sameDate) {
          res.status(401);
          res.send({
            msg: cityId + ", " + date + " already exists in the BD",
          });
        } else {
          var newForecastId = dbForecast.push().key;

          var newForecastEntry = {};
          newForecastEntry[newForecastId] = ForecastData;

          dbForecast.update(newForecastEntry);

          res.status(200);
          res.send({ ...newForecastEntry, newForecastId });
        }
      });
  }
});

module.exports = router;
