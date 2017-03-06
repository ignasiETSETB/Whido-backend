const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('../services/index');
const db = index.db;
//const events = db.child('events');
//const users = db.child('users');
const math = require('mathjs');
const ModuleLike = require('../controllers/likeEvent');

exports.likeEvent = function (req, res, next) {

  const {idEvent, idUser} = req.body;
  ModuleLike.likeEvent(idEvent,idUser,(obj)=>{
    res.json("event like done");
  });
};
