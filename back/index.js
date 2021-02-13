const express = require("express");
var cors = require("cors");
const app = express();
const port = 80;

app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

var locations = require("./locations");
var forecast = require("./forecast");

app.use("/locations", locations);
app.use("/forecast", forecast);

app.listen(process.env.PORT || port, () => {
  console.log(
    `Weather forecaster server listening at http://localhost:${port}`
  );
});
