const jwt = require('jwt-simple');
const extend = require('util')._extend;
const firebase = require('firebase');
const requestify = require('requestify');
const index = require('../services/index');
const db = index.db;
const events = db.child('events');
const privateEvents= db.child('privateEvents');
const ModuleNearby= require('./getNearbyEvents');
const ModuleKNN = require('../recommender/knnAlgorithm');
const ModuleCategory = require('../services/categories');
var async = require('async');



exports.getEventsArround = function(latitude,longitude,searchingDistance,similarityFactor,profileArray,category,callback) {

var location = { latitude, longitude };

requestify.get('https://whido-api.firebaseio.com/events.json').then(function(response) {
  // Get the response body
  let eventsBBDD = response.getBody();

  ModuleNearby.getNearbyEvents(location, searchingDistance, eventsBBDD, (nearbyEvents) => {

    //console.log(nearbyEvents);

    if (nearbyEvents.length) {
      if(category && category.length){
        let similars = [];
        async.series([
          function(callback){
            nearbyEvents.map((event,i)=>{
              //TODO: comprobar funcionament getCategory
              ModuleCategory.getCategory(event.id,(categoryReceived)=>{
                if(category == categoryReceived){
                  similars.push(event);
                }
                if(nearbyEvents.length == i+1){
                  callback();
                }
              });
            });
          },
        ], function(err,eo) {
            callback(similars);
    	  });
      }else{
        // Pass these events to the knnAlgorithm for computing similarity
        // The params for the KNN are user's profileArray, events[] and similarityFactor
        ModuleKNN.knn(profileArray, nearbyEvents, similarityFactor, (similarEvents) => {
          if (typeof(similarEvents) !== 'undefined' && nearbyEvents.length > 0) {
            callback(similarEvents);
          }else {
            callback('No similar events');
          }
        });
      }
    } else {
        callback('No nearby events in your area');
    }
  });
});
}
