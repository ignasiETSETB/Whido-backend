const Events = require('./services/events');
const PrivateEvents = require('./services/privateEvents');
const Users = require('./services/users');
const Categories = require('./services/categories');
const GeoLocate = require('./services/utils');
const CreateProfileUser = require('./recommender/createProfileUser');
const RateEvent = require('./recommender/rateEvent');
const LikeEvent = require('./recommender/likeEvent');
const DislikeEvent = require('./recommender/dislikeEvent');
const RatingData = require('./recommender/rating-data');
const process = require('process');

module.exports = function(app){

//RECOMMENDER

	app.post('/createProfileUser', CreateProfileUser.createProfileUser);
	app.post('/rateEvent', RateEvent.rateEvent);
	app.post('/likeEvent', LikeEvent.likeEvent);
	app.post('/dislikeEvent', DislikeEvent.dislikeEvent);
	app.get('/default_values', RatingData.default_values);

	//EVENTS
	app.post('/getEvents', Events.getEvents);
	app.post('/addEvent', Events.addEvent);
	app.get('/getEvent/:id', Events.getEventById);
	app.post('/updateEvent/:id', Events.updateEvent);
	app.post('/removeEvent/:id', Events.removeEvent);
	app.get('/getUsersfromEvent/:id', Events.getFullUsers);
	app.post('/leaveEvent/:id', Events.leaveEvent);
	app.post('/joinEvent/:id', Events.joinEvent);
	app.get('/getEventByTitle', Events.getEventByTitle);


	//PRIVATE EVENTS
	app.post('/addPrivateEvent' ,PrivateEvents.addPrivateEvent);
	app.post('/leavePrivateEvent/:id' ,PrivateEvents.leavePrivateEvent);


	//USERS
	app.get('/getUsers' ,Users.getUsers);
	app.post('/addUser', Users.addUser);
	app.get('/getUser/:id', Users.getUserByID);
	app.post('/updateUser/:id', Users.updateUser);
	app.post('/removeUser/:id', Users.removeUser);
	app.get('/getEventsOfUser/:id', Users.getEventsOfUser);
	app.get('/getPrivateEventsOfUser/:id', Users.getPrivateEventsOfUser);
	app.get('/getPastEvents/:id', Users.getPastEvents);

	//UTILS

	app.post('/geoLocate', GeoLocate.geoLocate);
	_dirname = process.cwd();
	app.get('/', (req, res) => {
		res.sendFile(_dirname + '/reference.html');
	});


	//CATEGORIES


	app.post('/addCategory', Categories.addCategory);


};
