const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('./index');
const db = index.db;
//const users= db.child('users');
//const events = db.child('events');
//const privateEvents= db.child('privateEvents');
const ModuleUsers = require('../controllers/getEventsOfUser');
const ModuleValidate = require('../controllers/validate');
const requestify = require('requestify');
var admin = require("firebase-admin");

//req: to get dates from client
//res: to give dates to client

exports.getUsers = function(req, res, next) {
	console.log('hola')
	var db = admin.database();
	var ref = db.ref("newUsers");
	var usersList = []
	ref.on("child_added", function(snapshot, prevChildKey) {
		
		usersList.push(snapshot.val());

	}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
	});
	function wait() {
		if(usersList.length == 0) {
			setTimeout(function() {
				wait();
			},1000);
		} else {
			res.json(usersList);

		}
	}
	wait();
};

exports.addUser = function(req, res, next) {
	//http://10.192.100.42:3090/addUser?username=Ignasi&password=1234567&latitude=4.5643&longitude=3.32134
	var params = req.query;
	var user = {};
	if(params.username)
	user["username"]=params.username;
	if(params.password)
	user["password"]=params.password;
	if(params.latitude)
	user["latitude"]=params.latitude;
	if(params.longitude)
	user["longitude"]=params.longitude;
	if(params.id)
	user["id"]=params.id;
	
	var userObject = {};
	userObject[params.username] = user;
	var db = admin.database();
	var ref = db.ref("newUsers");
	ref.child(params.username).set(user);
	res.json('Added ' + params.username + ' correctly')
};

exports.updateUser = function(req, res, next) {

    const idUser =req.params.id;
		const changed = req.body;
    users.child(idUser).update(changed);

    res.json(`USER with ID: ${idUser} UPDATED`);
};

exports.getUserByID = function (req, res, next) {


  const idUser = req.params.id;

	requestify.get(`https://whido-api.firebaseio.com/users/${idUser}.json`).then(function(response) {
			res.json(response.getBody());
	});

};

exports.getEventsOfUser = function (req, res, next) {

  const idUser = req.params.id;
		let msg = {};
		events.on('value', (event) => {
			eventsBBDD = event.val();
			ModuleUsers.getEventsOfUser(idUser, eventsBBDD, (results) => {
				msg = results;
			});
		});
		res.json(msg);
};


exports.getPrivateEventsOfUser = function (req, res, next) {
  const idUser = req.params.id;

		privateEvents.on('value', (event) => {
			eventsBBDD = event.val();
			ModuleUsers.getPrivateEventsOfUser(idUser, eventsBBDD, (results) => {
				res.json(results);
			});
		});
};

exports.removeUser = function (req, res, next) {

  const idUser = req.params.id;
  users.child(idUser).remove();
  res.json(`USER ${idUser} REMOVED`);

};

exports.getPastEvents = function (req, res, next) {
	const idUser = req.params.id;

	let pastEvents = [];

	events.on('value', (event) => {
		eventsBBDD = event.val();
		ModuleUsers.getEventsOfUser(idUser, eventsBBDD, (results) => {
			//res.json(results); // results es array y en cada campo: {id:key,infoUser:eventsBBDD[key]}

			for (const key in results) {
				if(results[key].infoUser.isGroup == true) {
					pastEvents.push(results[key]);
				}
			}
			res.json(pastEvents);
		});
	});

};
