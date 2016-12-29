const jwt = require('jwt-simple');
const ModuleCoord = require('../controllers/getCoordinates');

exports.geoLocate = function(req, res, next) {

  const address = req.body.address;

  ModuleCoord.getCoordinates(address,(coord)=>{
    res.json(coord);
  });

};
