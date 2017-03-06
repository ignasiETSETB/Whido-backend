const jwt = require('jwt-simple');
const googleMapsClient = require('@google/maps');
const index = require('../services/index');
const db = index.db;
//const users= db.child('users');
//const events= db.child('events');

exports.validateUser = function(idValidate, callback) {
  let exists = false;
  users.once('value', (json) => {
      let list = json.val();
      for(const id in list){
        //Si ya está la id, no lo añado
          if(id==idValidate){
            exists = true; //exists
          }
      }
      callback(exists);
  });
};
exports.validateEvent = function(idValidate,callback) {
  let exists = false;
  events.once('value', (json) => {
      let list = json.val();
      for(const id in list){
        //Si ya está la id, no lo añado
          if(id==idValidate){
            exists = true;
          }
      }
      callback(exists);
  });
};

exports.findEventByTitle = function(tit,callback) {
  let title = tit.toUpperCase();
  let eventFinded = [];
  events.once('value', (json) => {
      let list = json.val();
      for(const obj in list){
        let aux = list[obj].title ? list[obj].title.toUpperCase() : "";
        if(aux == title || aux.includes(title)){
          eventFinded.push({id:obj,content:list[obj]});
        }
      }
      callback(eventFinded);
  });
};
