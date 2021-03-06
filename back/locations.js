const express = require("express");
const router = express.Router();
const db = require("./db.js");

router.get("/", async (req, res, next) => {
  try {
    const dbCities = db.ref("/locations");

    let retrievedData;
    if (!req.query.filter) {
      retrievedData = await dbCities.once("value");
    } else {
      let numFields = Object.keys(req.query.filter).length;
      if (numFields === 0) {
        res.status(400);
        res.send({ msg: "You need to specify a field to filter by" });
      } else if (numFields > 1) {
        res.status(400);
        res.send({ msg: "Filtering by more than one field is not supported" });
      } else {
        const filterField = Object.keys(req.query.filter);

        if (Array.isArray(req.query.filter[filterField])) {
          res.status(400);
          res.send({
            msg: "Filtering a field by more than one value is not supported",
          });
        } else {
          retrievedData = await dbCities
            .orderByChild("/" + filterField)
            .equalTo(req.query.filter[filterField])
            .once("value");
        }
      }
    }

    let orderedData = [];

    retrievedData.forEach((childSnapshot) => {
      orderedData.push({
        ...childSnapshot.val(),
      });
    });

    if (req.query.order) {
      numFields = Object.keys(req.query.order).length;
      if (numFields === 0) {
        res.status(400);
        res.send({ msg: "You need to specify a field to order by" });
      } else if (numFields > 1) {
        res.status(400);
        res.send({
          msg: "Ordering by more than one field is not supported",
        });
      } else {
        const orderField = Object.keys(req.query.order);
        if (Array.isArray(req.query.order[orderField])) {
          res.status(400);
          res.send({
            msg: "Ordering a field by more than one criteria is not supported",
          });
        } else {
          if (!["ASC", "DES"].includes(req.query.order[orderField])) {
            res.status(400);
            res.send({
              msg:
                'Ordering is only supported in ASC or DES order. "' +
                req.query.order[orderField] +
                '" criteria is not supported',
            });
          } else {
            const isAscending = req.query.order[orderField] === "ASC";

            orderedData.sort((a, b) =>
              a[orderField] < b[orderField]
                ? isAscending
                  ? -1
                  : 1
                : a[orderField] > b[orderField]
                ? isAscending
                  ? 1
                  : -1
                : 0
            );
          }
        }
      }
    }
    res.status(200);
    res.send(orderedData);
  } catch (error) {
    return next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    let missingFields = [];

    const name = req.body.name;
    if (!name) {
      missingFields.push("name");
    }

    const country = req.body.country;
    if (!country) {
      missingFields.push("country");
    }

    const slug = req.body.slug;
    if (!slug) {
      missingFields.push("slug");
    }

    if (missingFields.length > 0) {
      res.status(400);
      res.send({ msg: missingFields.toString() + " fields missing" });
    } else {
      const cityData = {
        name,
        country,
        slug,
      };

      const dbCities = db.ref("/locations");

      dbCities
        .orderByChild("name")
        .equalTo(name)
        .once("value", (snapshot) => {
          let sameCity = false;
          let sameCountry = false;
          if (snapshot.exists()) {
            sameCity = true;
            snapshot.forEach((childSnapshot) => {
              const childData = childSnapshot.val();
              sameCountry = sameCountry || childData.country === country;
            });
          }

          if (sameCity && sameCountry) {
            res.status(400);
            res.send({
              msg: name + ", " + country + " already exists in the BD",
            });
          } else {
            dbCities
              .orderByChild("slug")
              .equalTo(slug)
              .once("value", (snapshot) => {
                if (snapshot.exists()) {
                  res.status(400);
                  res.send({
                    msg: slug + " already exists in the BD",
                  });
                } else {
                  const newCityID = dbCities.push().key;

                  let newCitiesEntry = {};
                  newCitiesEntry[newCityID] = cityData;

                  dbCities.update(newCitiesEntry);

                  res.status(201);
                  res.send(cityData);
                }
              });
          }
        });
    }
  } catch (error) {
    return next(error);
  }
});

router.delete("/", (req, res, next) => {
  try {
    const dbLocations = db.ref("/locations");

    dbLocations.remove().then(() => {
      res.status(200);
      res.send("All locations data deleted from /locations");
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
