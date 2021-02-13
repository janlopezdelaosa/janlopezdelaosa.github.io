var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount:
    "weather-forecast-3359c-firebase-adminsdk-mzu4s-11e6511973.json",
  databaseURL: "https://weather-forecast-3359c-default-rtdb.firebaseio.com/",
}); //by adding your credentials, you get authorized to read and write from the database

var db = firebase.database();

module.exports = db;
