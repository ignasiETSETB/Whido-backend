const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const events = db.child('events');
//const privateEvents= db.child('privateEvents');
//const users = db.child('users');
const math = require('mathjs');
const norm = require('../recommender/normalizeArray');
const features = require('../recommender/features');
const actualizeArrayUser = require('../recommender/actualizeProfileArrayUser');

exports.likeEvent = function (idEvent,idUser,callback) {
  var userProfileArray;
  var eventProfileArray;

  users.child(idUser).child('profileArray').once("value",(userProfileArray) => {
    events.child(idEvent).child('profileArray').once("value",(eventProfileArray) => {
      var newUserProfileArrayNormalized = null;
      var newEventProfileArrayNormalized = null;

      newEventProfileArrayNormalized = norm(math.add(eventProfileArray.val(), math.multiply(userProfileArray.val(), 0.05)));
      newUserProfileArrayNormalized = norm(math.add(userProfileArray.val(), math.multiply(eventProfileArray.val(), 0.05)));

      features.saveProfileUser(idUser, newUserProfileArrayNormalized);
      features.saveProfileEvent(idEvent, newEventProfileArrayNormalized);

    });
  });
  callback(true);
};

exports.likePrivateEvent = function (idEvent,idUser,callback) {
  var userProfileArray;
  var eventProfileArray;

  users.child(idUser).child('profileArray').once("value",(userProfileArray) => {
    privateEvents.child(idEvent).child('profileArray').once("value",(eventProfileArray) => {
      var newUserProfileArrayNormalized = null;
      var newEventProfileArrayNormalized = null;

      newEventProfileArrayNormalized = norm(math.add(eventProfileArray.val(), math.multiply(userProfileArray.val(), 0.05)));
      newUserProfileArrayNormalized = norm(math.add(userProfileArray.val(), math.multiply(eventProfileArray.val(), 0.05)));

      features.saveProfileUser(idUser, newUserProfileArrayNormalized);
      features.saveProfilePrivateEvent(idEvent, newEventProfileArrayNormalized);

    });
  });
  callback(true);
};
