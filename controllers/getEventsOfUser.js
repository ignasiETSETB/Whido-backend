const jwt = require('jwt-simple');
const extend = require('util')._extend;
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const events = db.child('events');
//const privateEvents= db.child('privateEvents');

exports.getEventsOfUser = function(idUser,eventsBBDD,callback) {

  let eventsOfUser = [];

  for(const key in eventsBBDD) {

      events.child(key).once('value',(event)=>{
        if(event.child("usersIn").exists()){

          const usersIn = events.child(key).child('usersIn');
          usersIn.once('value', (ides)=> {

            if (ides.val()) {
              for(const id of ides.val()){
                if(idUser === id || idUser == id){
                  eventsOfUser.push({id:key,infoUser:eventsBBDD[key]});
                }
              }
            } else {
              console.log("NO HAY VALOR EN USERSIN");
            }
          });
        }
      });
  }
  callback(eventsOfUser);
	return true ;
};


exports.getPrivateEventsOfUser = function(idUser,privateEventsBBDD,callback) {

  let eventsOfUser = [];

  for(const key in privateEventsBBDD) {

      privateEvents.child(key).once('value',(event)=>{
        if(event.child("usersIn").exists()){

          const usersIn = privateEvents.child(key).child('usersIn');
          usersIn.once('value', (ides)=> {

            if (ides.val()) {
              for(const id of ides.val()){
                if(idUser === id || idUser == id){
                  eventsOfUser.push({id:key,infoUser:privateEventsBBDD[key]});
                }
              }
            } else {
              console.log("NO HAY VALOR EN USERSIN");
            }
          });
        }
      });
  }
  callback(eventsOfUser);
	return true ;
};
