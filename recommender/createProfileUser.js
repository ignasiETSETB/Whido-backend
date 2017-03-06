const jwt = require('jwt-simple');
const firebase = require('firebase');
const ModuleRatingData = require('./rating-data');
const math = require('mathjs');
const norm = require('./normalizeArray');
const features = require('./features');

exports.createProfileUser = function (req, res, next) {

  const profile = req.body.createProfileUser;
  const idUser = req.body.idUser;

  var NightLife = math.multiply(ModuleRatingData.rating_data.NightLife, profile.NightLife);
  var Culture = math.multiply(ModuleRatingData.rating_data.Culture, profile.Culture);
  var FoodDrinks = math.multiply(ModuleRatingData.rating_data.FoodDrinks, profile.FoodDrinks);
  var Sports = math.multiply(ModuleRatingData.rating_data.Sports, profile.Sports);
  var EducationTraining = math.multiply(ModuleRatingData.rating_data.EducationTraining, profile.EducationTraining);
  var Purchases = math.multiply(ModuleRatingData.rating_data.Purchases, profile.Purchases);
  var Music = math.multiply(ModuleRatingData.rating_data.Music, profile.Music);
  var Others = math.multiply(ModuleRatingData.rating_data.Others, profile.Others);
  var categories = [NightLife, Culture, FoodDrinks, Sports, EducationTraining, Purchases, Music, Others];
  var aux = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  for(i = 0; i<8; i++){
    aux = math.add(aux,categories[i]);
  }
  //aux es el vector amb la suma de totes les categories, ara nomes falta normalitzar-lo
  //un cop normalitzat, guardar lusuari fent servir el idUser i el vector normalitzat
  var normalizedArray = norm(aux);
  features.saveProfileUser(idUser, normalizedArray);
  res.json({idUser,normalizedArray});

};
