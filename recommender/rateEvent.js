const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
const events = db.child('events');
const users = db.child('users');
const math = require('mathjs');
const norm = require('./normalizeArray');
const features = require('./features');
const actualizeArrayUser = require('./actualizeProfileArrayUser');
const eventToGroup = require('../controllers/eventToGroup');
const eventIsOver = require('../controllers/eventIsOver');

exports.rateEvent = function (req, res, next) {
  var userProfileArray;
  var eventProfileArray;
  const {rating, idEvent, idUser} = req.body;

  users.child(idUser).child('profileArray').once("value",(userProfileArray) => {
    events.child(idEvent).child('profileArray').once("value",(eventProfileArray) => {
      var newUserProfileArrayNormalized = null;
      switch(rating) {
        case 1:
          newUserProfileArrayNormalized = actualizeArrayUser(-0.2, idUser, userProfileArray, eventProfileArray);
          eventToGroup(idEvent);
          res.json({idUser,newUserProfileArrayNormalized});
          break;
        case 2:
          newUserProfileArrayNormalized = actualizeArrayUser(-0.1, idUser, userProfileArray, eventProfileArray);
          eventToGroup(idEvent);
          res.json({idUser,newUserProfileArrayNormalized});
          break;
        case 3:
          newUserProfileArrayNormalized = actualizeArrayUser(0, idUser, userProfileArray, eventProfileArray);
          eventToGroup(idEvent);
          res.json({idUser,newUserProfileArrayNormalized});
          break;
        case 4:
          newUserProfileArrayNormalized = actualizeArrayUser(0.1, idUser, userProfileArray, eventProfileArray);
          eventToGroup(idEvent);
          res.json({idUser,newUserProfileArrayNormalized});
          break;
        case 5:
          newUserProfileArrayNormalized = actualizeArrayUser(0.2, idUser, userProfileArray, eventProfileArray);
          eventToGroup(idEvent);
          res.json({idUser,newUserProfileArrayNormalized});
          break;
        default:
          res.json("The rating we have obtained dit not match our system rating");
          break;
      }
    });
  });
};
