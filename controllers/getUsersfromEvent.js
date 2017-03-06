const jwt = require('jwt-simple');
const extend = require('util')._extend;
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const users= db.child('users');
//const events= db.child('events');

exports.getUsersfromEvent = function(idEvent,usersBBDD,callback) {

      //OBTNGO ARRAY 'ides' DEL EVENTO 'idEvent'
      let ides = [];

      const idesEvent = events.child(idEvent).child('usersIn');
      idesEvent.once('value', (event)=> {
          usersOfEvent=[];

          if (event.val()) {

              ides=event.val();
              //ELIMINO LOS VALORES QUE SEAN ''
              ides = ides.filter((n)=>{
                   return n != undefined
               });

               //BUSCO USERS DE 'ides' PARA OBTENER SU INFO
               for(const key in usersBBDD) {
                   // SI LA ID DE NUESTRO OBJETO PERTENECE AL ARRAY 'ides'
                   if(ides.indexOf(key)>=0){
                       usersOfEvent.push({id:key,infoUser:usersBBDD[key]});
                   }
               }
               callback(usersOfEvent);
          } else {
              callback('Invalid event');
          }
      });

			return true ;
};
