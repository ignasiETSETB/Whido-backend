const jwt = require('jwt-simple');
const googleMapsClient = require('@google/maps');
const index = require('../services/index');
const api = index.coordinatesApi;

/*
{
    "location" : "1600 Amphitheatre Parkway, Mountain View, CA",
}
 */

exports.getCoordinates = function(address, callback) {

  api.geocode({
      address
  }, (err, coord)=> {
    if (!err) {
      const location = coord.json.results[0].geometry.location;
      callback({"latitude":location.lat,'longitude': location.lng});
    }
  });

};
