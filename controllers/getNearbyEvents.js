const jwt = require('jwt-simple');
const extend = require('util')._extend;
const geolib = require('geolib');

exports.getNearbyEvents = function (location, searchingDistance, eventsBBDD, callback) {

  const nearbyEvents = [];
    // Loop all events
  for (const key in eventsBBDD) {

    if(!eventsBBDD[key].latitude || !eventsBBDD[key].longitude){
        // If there are no coordenates for this event skip this iteration
        continue;
    }
    const eventLocation = {
        latitude: eventsBBDD[key].latitude,
        longitude: eventsBBDD[key].longitude
    }
    
    // Show the latitude & longitude of the events
    // Calculate the distance between two coordenates
    const distance = geolib.getDistance(location, eventLocation);
      if (distance < searchingDistance) {
          // Add distance to event to sort them by distance later
          eventsBBDD[key].distance = distance;
          nearbyEvents.push(eventsBBDD[key]);
      }
    }

  // Check if the array exists and it's length is bigger than one
  // Sort it...
  if (  typeof(nearbyEvents) !== 'undefined' && nearbyEvents.length > 0) {

    nearbyEvents.sort(function (a, b) {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value <= b.value) {
            return -1;
        }
        });
        //nearbyEvents.reverse();
  }

  callback(nearbyEvents);
};
