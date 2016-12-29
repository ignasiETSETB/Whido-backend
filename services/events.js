const jwt = require('jwt-simple');
const firebase = require('firebase');
var async = require('async');
const index = require('./index');
const db = index.db;
const events = db.child('events');
const users = db.child('users');
const ModuleUsers = require('../controllers/getUsersfromEvent');
const ModuleGetUsersIn = require('../controllers/getUsersIn');
const ModuleValidate = require('../controllers/validate');
const ModuleProfileArray = require('../recommender/features');
const ModuleProfileEvent = require('../recommender/createProfileEvent');
const ModuleEvents = require('../controllers/getEventsArround');
const ModuleEventIsOver = require('../controllers/eventIsOver.js');
const ModuleIsGroup = require('../controllers/isGroup.js');
const ModuleGroup = require('../controllers/eventToGroup');
const requestify = require('requestify');


exports.getEvents = function (req, res, next) {

  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var searchingDistance = req.body.searchingDistance;
  var profileArray = req.body.profileArray;
  var similarityFactor = req.body.similarityFactor;
  var category = req.body.category;


  ModuleEvents.getEventsArround(latitude,longitude,searchingDistance,similarityFactor,profileArray,category,(eventsBBDD)=>{
    var eventsValids = [];
    let groups = 0;
    async.series([
      function(callback){
        eventsBBDD.map((event,i)=>{
          eventsValids.push(event);
          if(i == eventsBBDD.length-1){
            callback(eventsValids);
            }
      });
    },
  ], function(err,eo) {
      res.json(eventsValids);
  });
 });
}

//
// exports.getEvents = function (req, res, next) {
//
//   var latitude = req.body.latitude;
//   var longitude = req.body.longitude;
//   var searchingDistance = req.body.searchingDistance;
//   var profileArray = req.body.profileArray;
//   var similarityFactor = req.body.similarityFactor;
//   var category = req.body.category;
//
//   requestify.get(`https://whido-api.firebaseio.com/events.json`).then(function(response) {
// 			res.json(response.getBody());
// 	});
//
// };
exports.addEvent = function (req, res, next) {

  // const { type , event , createProfileEvent } = req.body;
  const event = req.body;
	const idEvent  = event.id ? event.id : "";
	const createProfileEvent = event.createProfileEvent ? event.createProfileEvent : [] ;
	let msg = "";

	if(!event.type){
    console.log("ERROR, you must put the type ( facebook or whido )");
		msg = null;
	}else{
		if (event.type === "facebook"){
			if(idEvent){
				ModuleValidate.validateEvent(idEvent,(exists)=>{
					if(!exists){
						events.child(idEvent).update(event);
						ModuleProfileArray.saveProfileEvent(idEvent,[]);
						msg = `Added event ${idEvent}`;
					}else{
            console.log("The event with id "+idEvent+" already exists. You can not added again");
						msg =null;
					}
				});
			}else{
        console.log("Incompatible content. If your type is facebook you must put an id");
				msg=null;
			}
	  } else if(event.type === "whido"){
				delete event.createProfileEvent;
	      var keyHolder = events.push(event);
				ModuleProfileEvent.createProfileEvent(keyHolder.key,createProfileEvent);
				msg = `Added event ${keyHolder.key}`;

	  }else{
      console.log("ERROR, you must put the type ( facebook or whido )");
			msg = null;
		}
	}
	res.json(msg);
};

exports.updateEvent = function (req, res, next) {

	const idEvent = req.params.id;
	const changed = req.body;
	events.child(idEvent).update(changed);
	res.json(`EVENT with ID: ${idEvent} UPDATED`);
};

exports.getEventById = function (req, res, next) {

	const idEvent = req.params.id;
  requestify.get(`https://whido-api.firebaseio.com/events/${idEvent}.json`).then(function(response) {
			res.json(response.getBody());
	});
  //
	// const singleEvent = events.child(`${idEvent}`);
	// singleEvent.once('value', (event) => {
	// 	if (event.val()) {
	// 		res.json(event.val());
	// 	} else {
	// 		res.json('Invalid event');
	// 	}
	// });
};

exports.removeEvent = function (req, res, next) {

	const idEvent = req.params.id;
	events.child(idEvent).remove();
	res.json(`USER ${idEvent} REMOVED`);
};

exports.getFullUsers = function (req, res, next) {

	const idEvent = req.params.id;
	users.on('value', (user) => {
		usersBBDD = user.val();
		ModuleUsers.getUsersfromEvent(idEvent, usersBBDD, (results) => {
			res.json(results);
		});
	});
};

exports.leaveEvent = function (req, res, next) {

	const idEvent = req.params.id;
	const idUser = req.body.idUser;

		ModuleGetUsersIn.getUsersIn(idEvent, (ides) => {

		//We receive the list of ides from the function getUsersIn
		if (ides.indexOf(parseInt(idUser)) != -1) {
			let index = ides.indexOf(idUser);
			// Removes one element starting from index
			ides.splice(index, 1);
						events.child(idEvent).child('usersIn').set(ides);
						res.json(ides);
		} else {
      console.log('Error, user not found the participants list');
			res.json(null);
		}
		});
};

exports.joinEvent = function (req, res, next) {

	const idEvent = req.params.id;
	const idUser = req.body.idUser;

		ModuleGetUsersIn.getUsersIn(idEvent, (ides) => {
		//We receive the list of ides from the function getUsersIn

		if (ides.indexOf(idUser) == -1 && ides !== []) {
			//Insert a new participant
			ides.push(idUser);
			//Save it on the db
			events.child(idEvent).child('usersIn').set(ides);

			users.child(idUser).child('profileArray').once("value",(editedArray)=> {

					ModuleProfileArray.profileEventInJoin(idEvent,editedArray.val(),(array)=>{
							res.json(array);
					});
			});
		} else {
			//Check if the user is already there
      console.log('Error, user already exists in the participants list');
			res.json(null);
		}
		});
};
exports.getEventByTitle = function (req, res, next) {

		const {title} = req.query;
		ModuleValidate.findEventByTitle(title, (event) => {
			res.json(event);
		});
};
