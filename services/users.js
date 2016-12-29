const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('./index');
const db = index.db;
const users= db.child('users');
const events = db.child('events');
const privateEvents= db.child('privateEvents');
const ModuleUsers = require('../controllers/getEventsOfUser');
const ModuleValidate = require('../controllers/validate');
const requestify = require('requestify');


//req: to get dates from client
//res: to give dates to client

exports.getUsers = function(req, res, next) {

	requestify.get('https://whido-api.firebaseio.com/users.json').then(function(response) {
		res.json(response.getBody());
	});
};

exports.addUser = function(req, res, next) {

  	const idUser = req.body.id;
		const user = req.body; // QUITAR LA ID DEL BODY?
		let msg = "";

		if(idUser){
			ModuleValidate.validateUser(idUser,(exists)=>{
				if(!exists){
					users.child(idUser).update(user);
					msg = ("USER ADDED");
				}else{
					msg = null;
					console.log("The user with id "+idUser+" already exists. You can not add it again");
				}
			});

		}else{
			msg = null;
			console.log("The user does not have an id");
		}

		res.json(msg);
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
