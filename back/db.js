var firebase = require("firebase");
const dotenv = require("dotenv");

dotenv.config();

firebase.initializeApp({
  serviceAccount: {
    projectId: process.env.PROJECT_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
  },
  databaseURL: process.env.DATABASE_URL,
});

var db = firebase.database();

module.exports = db;
