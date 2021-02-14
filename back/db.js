var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  },
  databaseURL: process.env.DATABASE_URL,
});

var db = firebase.database();

module.exports = db;
