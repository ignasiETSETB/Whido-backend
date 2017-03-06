const jwt = require('jwt-simple');
const extend = require('util')._extend;
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const users= db.child('users');
//const events= db.child('events');
//const privateEvents= db.child('privateEvents');

exports.getUsersIn= function(idEvent, callback){

  events.child(idEvent).once("value",(event)=> {
    if(event.child("usersIn").exists()){

      const idesEvent = events.child(idEvent).child('usersIn');
      idesEvent.once('value', (ides)=> {

        if (ides.val()) {
            ides=ides.val();
            //Eliminate empty keys ''
            ides = ides.filter((n)=>{
                 return n != undefined
             });
             //Run the callback function passing the list
             callback(ides);
        } else {
            callback('Invalid event');
        }
      });
    }else {
      callback([]);
    }
  });
}


exports.getUsersInPrivate= function(idEvent, callback){

  privateEvents.child(idEvent).once("value",(event)=> {

    if(event.child("usersIn").exists()){

      const idesEvent = privateEvents.child(idEvent).child('usersIn');
      idesEvent.once('value', (ides)=> {

        if (ides.val()) {
            ides=ides.val();
            //Eliminate empty keys ''
            ides = ides.filter((n)=>{
                 return n != undefined
             });
             //Run the callback function passing the list
             callback(ides);
        } else {
            callback('Invalid event');
        }
      });
    }else {
      callback([]);
    }
  });
}
