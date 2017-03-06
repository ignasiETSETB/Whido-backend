const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const events = db.child('events');
//const users = db.child('users');

// funció que retorna true si isGroup=true i false si (isGroup=false || no existeix el camp isGroup)
//exemple de com s'utilitza a eventToGroup.js

module.exports = function (idEvent, callback) {
  events.child(idEvent).once("value", (event) => {
    if (event.child('isGroup').exists()){
      events.child(idEvent).child('isGroup').once("value", (bool) => {
        if (bool.val()==true){
          callback(true)
        } else{
          callback(false);
        }
      });
    } else{
      callback(false);
    }
  });
}
