const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const math = require('mathjs');
const db = index.db;
const events = db.child('events');
const users = db.child('users');
const privateEvents= db.child('privateEvents');
const norm = require('./normalizeArray');

exports.saveProfileUser = function(idUser,normalizedArray) {

    let array = users.child(idUser).child('profileArray');
    array.set(normalizedArray);
};


// Llamar desde evento o desde comparaciones para modificar el vector perfil del evento
exports.saveProfileEvent = function(idEvent,editedArray) {

    events.child(idEvent).once("value",(event)=> {
      if(event.child("profileArray").exists()){

        let array = events.child(idEvent).child('profileArray');
        editedArray.length ? array.set(editedArray) : null;

      }else{
        let array = events.child(idEvent).child('profileArray');
        array.update([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

      }
    });
};


//Llamar desde evento o desde comparaciones para modificar el vector perfil del evento
exports.profileEventInJoin = function(idEvent,profileArrayUser,callback) {

  events.child(idEvent).once("value",(event)=> {
    if(!event.val()){
      callback(false);
    }
    else if(event.child("profileArray").exists()){
      let editedArray = [];
      const userArray = profileArrayUser ? math.multiply(profileArrayUser, 0.1) : null ;

      events.child(idEvent).child("profileArray").once("value",(eventArray)=> {
        editedArray = math.add(eventArray.val(),userArray);
        const editedNormArray= norm(editedArray);
        events.child(idEvent).child('profileArray').set(editedNormArray);
        callback(editedNormArray);
      });

    }else{
      let array = events.child(idEvent).child('profileArray');
      profileArrayUser.length ? array.set(profileArrayUser) : null;
      callback(profileArrayUser);
    }
  });
};


//********* P R I V A T E    E V E N T S ***********


exports.saveProfilePrivateEvent = function(idEvent,editedArray) {

    privateEvents.child(idEvent).once("value",(event)=> {
      if(event.child("profileArray").exists()){

        let array = privateEvents.child(idEvent).child('profileArray');
        editedArray.length ? array.set(editedArray) : null;

      }else{
        let array = privateEvents.child(idEvent).child('profileArray');
        array.update([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

      }
    });
};

//Llamar desde evento o desde comparaciones para modificar el vector perfil del evento
exports.profilePrivateEventInJoin = function(idEvent,profileArrayUser,callback) {

  privateEvents.child(idEvent).once("value",(event)=> {
    if(event.child("profileArray").exists()){
      let editedArray = [];
      const userArray = profileArrayUser ? math.multiply(profileArrayUser, 0.1) : null ;

      privateEvents.child(idEvent).child("profileArray").once("value",(eventArray)=> {
        editedArray = math.add(eventArray.val(),userArray);
        const editedNormArray= norm(editedArray);
        privateEvents.child(idEvent).child('profileArray').set(editedNormArray);
        callback(editedNormArray);
      });

    }else{
      let array = privateEvents.child(idEvent).child('profileArray');
      profileArrayUser.length ? array.update(profileArrayUser) : null;
      callback(profileArrayUser);
    }
  });
};
