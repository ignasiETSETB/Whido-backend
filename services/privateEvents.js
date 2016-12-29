const jwt = require('jwt-simple');
const firebase = require('firebase');
var async = require('async');
const index = require('./index');
const db = index.db;
const users = db.child('users');
const events = db.child('events');
const privateEvents= db.child('privateEvents');
const ModuleUsers = require('../controllers/getUsersfromEvent');
const ModuleGetUsersIn = require('../controllers/getUsersIn');
const ModuleValidate = require('../controllers/validate');
const ModuleProfileArray = require('../recommender/features');
const ModuleLike = require('../controllers/likeEvent');


exports.addPrivateEvent = function (req, res, next) {

	const idUser = req.body.idUser ? req.body.idUser : "";
  const {event , isPrivate} = req.body;
	let msg = "";
	let userIsValid = false;
	    async.series([
	        //Load user to get `userId` first
	        function(callback) {
						ModuleValidate.validateUser(idUser,(exists)=>{
							if(exists){
								if(isPrivate){
									getPrivateEvents((privateEventsBBDD)=>{
											const idesEventos = privateEventsBBDD.map((e)=>{
													return e.id;
											})
											if(idesEventos.indexOf(event.id)<0){
													privateEvents.child(event.id).set(event);
													ModuleProfileArray.saveProfilePrivateEvent(event.id,[]);
											}
											ModuleGetUsersIn.getUsersInPrivate(event.id, (ides) => {

											if(event.rsvp_status == "attending"){
												//We receive the list of ides from the function getUsersInPrivate
												if (ides.indexOf(idUser) == -1 && ides !== []) {
													ides.push(idUser);
													//Save it on the db
													privateEvents.child(event.id).child('usersIn').set(ides);
													users.child(idUser).child('profileArray').once("value",(editedArray)=> {
															ModuleProfileArray.profilePrivateEventInJoin(event.id,editedArray.val() ? editedArray.val() : [] ,(array)=>{
																		msg = ("The user has joined the private event");
																		callback();
															});
													});
												} else {
													//Check if the user is already there
														msg = ('Error, user already exists in the participants list');
														callback();

												}
											}else{
												//Solo modificar el vector del evento privado (like)
												//TODO
												ModuleLike.likePrivateEvent(event.id,idUser,()=>{
														msg =("The user has the private event but has not done join");
														callback();

												});
											}
										});
									});
								}else{										//si es publico pero tiene relacion conmigo

									getEvents((eventsBBDD)=>{
											const idesEventos = eventsBBDD.map((e)=>{
													return e.id;
											})
											if(idesEventos.indexOf(event.id)<0){
													events.child(event.id).set(event);
													ModuleProfileArray.saveProfileEvent(event.id,[]);
											}
											ModuleGetUsersIn.getUsersIn(event.id, (ides) => {

												if(event.rsvp_status == "attending"){
														//We receive the list of ides from the function getUsersIn

														if (ides.indexOf(idUser) == -1 && ides !== []) {
															//Insert a new participant
															ides.push(idUser);
															//Save it on the db
															events.child(event.id).child('usersIn').set(ides);
															users.child(idUser).child('profileArray').once("value",(editedArray)=> {
																ModuleProfileArray.profileEventInJoin(event.id,editedArray.val(),(array)=>{
																	if(!array){
																		msg =("The event does not exists. You can add it form 'add event' ");
																		callback();

																	}else{
																		//TODO: aqui si el evento no exisitia pues poner la infoooo
																		msg = ("The user has joined the public event");
																		callback();
																	}
																});
															});
														} else {
															//Check if the user is already there
															msg = ('Error, user already exists in the participants list');
															callback();
														}
												}else{
													//Solo modificar el vector del evento (like)
													//TODO
													ModuleLike.likeEvent(event.id,idUser,()=>{
														 msg = ("The user is related with the public event but has not done join");
														 callback();
													});
												}
											});
									});
								}
								// callback(msg);
							}else{
								msg = ("User is not logged");
								callback(msg);
							}
							// callback();
						});
	        },
	        //Load posts (won't be called before task 1's "task callback" has been called)
	        // function(callback) {
	        //     db.query('posts', {userId: userId}, function(err, posts) {
	        //         if (err) return callback(err);
	        //         locals.posts = posts;
	        //         callback();
	        //     });
	        // }
	    ], function(err,eo) { //This function gets called after the two tasks have called their "task callbacks"
	        if (err) return next(err);
	        //Here locals will be populated with `user` and `posts`
	        //Just like in the previous example
	        res.json(msg);
	    });
};

getPrivateEvents = function (callback) {

		privateEvents.once('value', (event) => {
  		jsonObj = event.val();
      var arr = jsonObj ? Object.keys(jsonObj).map(function (key) { return jsonObj[key]; }) : [];
      callback(arr);
  		return true;
	  });
};

getEvents = function (callback) {

		events.once('value', (event) => {
  		jsonObj = event.val();
      var arr = jsonObj ? Object.keys(jsonObj).map(function (key) { return jsonObj[key]; }) : [];
      callback(arr);
  		return true;
	  });
};

//
// exports.removePrivateEvent = function (req, res, next) {
//
// 	const idEvent = req.params.id;
// 	privateEvents.child(idEvent).remove();
// 	res.json(`EVENT ${idEvent} REMOVED`);
// };
//

exports.leavePrivateEvent = function (req, res, next) {

	const idEvent = req.params.id;
	const idUser = req.body.idUser;

		ModuleGetUsersIn.getUsersInPrivate(idEvent, (ides) => {
		//We receive the list of ides from the function getUsersIn
		if (ides.indexOf(parseInt(idUser)) != -1) {
			let index = ides.indexOf(idUser);
			// Removes one element starting from index
			ides.splice(index, 1);
			privateEvents.child(idEvent).child('usersIn').set(ides);
			res.json(ides);
		} else {
			res.json('Error, user not found the participants list')
		}
	});
};
