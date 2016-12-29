const firebase = require('firebase');
const googleMapsClient = require('@google/maps');

const conf = {
  databaseURL: "https://whido-api.firebaseio.com/",
//  databaseURL: "https://fir-experiment-23653.firebaseio.com/",
};

firebase.initializeApp(conf);
exports.db = firebase.database().ref('/'); //db


exports.coordinatesApi = googleMapsClient.createClient({
  key: 'AIzaSyClKOttyR61jd-8PV2o65yK_sXDH9zKPc8'
  // timeout
});
