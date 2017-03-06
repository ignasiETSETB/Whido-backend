const firebase = require('firebase');
const googleMapsClient = require('@google/maps');
var admin = require("firebase-admin");

var serviceAccount = require("whido-api-master-firebase-adminsdk-9658k-c66df90ff8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://whido-api-master.firebaseio.com"
});


exports.coordinatesApi = googleMapsClient.createClient({
  key: 'AIzaSyClKOttyR61jd-8PV2o65yK_sXDH9zKPc8'
  // timeout
});
