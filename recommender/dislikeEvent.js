const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const events = db.child('events');
//const users = db.child('users');
const math = require('mathjs');
const norm = require('./normalizeArray');
const features = require('./features');

exports.dislikeEvent = function (req, res, next) {
  var userProfileArray;
  var eventProfileArray;
  var aux = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  const {idEvent, idUser} = req.body;

  users.child(idUser).child('profileArray').once("value",(userProfileArray) => {
    events.child(idEvent).child('profileArray').once("value",(eventProfileArray) => {
      var newEventProfileArrayNormalized = null;
      if(eventProfileArray == aux ){
        newEventProfileArrayNormalized = -userProfileArray;
      } else {
        newEventProfileArrayNormalized = norm(math.add(eventProfileArray.val(), math.multiply(userProfileArray.val(), -0.05)));
      }

      features.saveProfileEvent(idEvent, newEventProfileArrayNormalized);

      res.json({idEvent, newEventProfileArrayNormalized});
    });
  });
};
