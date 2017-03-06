const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const events = db.child('events');
//const users = db.child('users');
const isGroup = require('./isGroup');
// Funció que es cridarà des de rateEvent que convertirà evento a grup
//isGroup -> true

module.exports = function (idEvent) {
  isGroup(idEvent, (results) => {
    if (results == false){
      events.child(idEvent).child('isGroup').set(true);
    }
  });
}
