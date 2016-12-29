const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
const events = db.child('events');
const isGroup = require('./isGroup');
const ModuleEventToGroup = require('./eventToGroup');

// funció que es cridarà des de getEvents
// fara que no es mostrin els eventos que (són grups || tenen la data passada)
// i els que ja tenen la data passada es convertiran a groups
// es per si crides getEvents abans de què algú hagi fet rate, pq no et surtin eventos passats

//retorna true si l'envento encara és evento
//retorna false si l'evento és un grup || ja ha passat(el converteix en un grup)

module.exports = function (idEvent, callback) {
  events.child(idEvent).once("value", (event) => {
    if(event.child("end_time").exists()){
      events.child(idEvent).child("end_time").once("value", (date) => {
        //ojo pq pot ser que existeixi pero no hi hagi res! end_time="", mirar de fer un if o algu
        if(date.val()==""){
          //no sabem quan acaba aquest evento mirar start_time!
          events.child(idEvent).child("start_time").once("value", (date) => {
            aux = date.val().split("+");
            fechaEvento = aux[0].split("T");
            fechaActual = getDateTime("fecha");
            horaActual = horaActual = getDateTime("hora");
            if(Date.parse(fechaEvento[0]+" "+horaActual) > Date.parse(fechaActual+" "+horaActual)) {
              //la fecha de start_time és futura respecte l'actual, per tant encara està actiu
              callback(true);
            }else{
              //la fecha d'inici del evento és passada
              //***********evenToGroup!!!****************
              // ModuleEventToGroup(idEvent);
              //events.child(idEvent).child('isGroup').set(true);
              //console.log(idEvent+": fecha inicio pasada!");
              callback(false);
            }
          });
        }else{
          aux = date.val().split("+");
          fechaEvento = aux[0].split("T");
          fechaActual = getDateTime("fecha");
          horaActual = getDateTime("hora");
          if (Date.parse(fechaEvento[0]+" "+fechaEvento[1]) > Date.parse(fechaActual+" "+horaActual)){
            // si entra al if, vol dir que l'envento encara està actiu.
            callback(true);
          } else {
            // l'evento ja ha passat, per tant tocar cridar a eventToGroup.
            //***********evenToGroup!!!****************
            callback(false);
          }
        }
      });
    }else {
      //no existeix el camp end_time, no sabem quan acaba aquest evento
      //COM NO SABEM RES, LI FOTEM GROUP I ALE
      //***********evenToGroup!!!****************
      callback("?");
    }
  });
}

function getDateTime(param) {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  if (param == "fecha") {
    return year + "-" + month + "-" + day;
  } else if (param == "hora") {
    return hour + ":" + min + ":" + sec;
  } else {
    return year + "-" + month + "-" + day + " " +hour + ":" + min + ":" + sec;
  }
}
