var firebase = require("firebase");

firebase.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://weather-forecast-3359c-default-rtdb.firebaseio.com/",
});

var db = firebase.database();

module.exports = db;
