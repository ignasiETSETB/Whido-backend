const jwt = require('jwt-simple');
const firebase = require('firebase');
const index = require('./index');
const db = index.db;
//const events = db.child('events');
//const categories = db.child('categories');
//const users = db.child('users');
const ModuleRatingData = require('../recommender/rating-data');
const math = require('mathjs');
const norm = require('../recommender/normalizeArray');
const requestify = require('requestify');


exports.addCategory = function (req, res, next) {

  const {name , id} = req.body;

		if (name && id){
        categories.child(id).update({'title': name});
        res.json(`Added category ${id}`);
	  }else{
			res.json("ERROR, you must put a category");
		}
}


exports.getCategory = function (idEvent, callback) {
  events.child(idEvent).child('profileArray').once("value", (array) => {
    var NightLife = math.multiply(ModuleRatingData.rating_data.NightLife, array.val());
    var Culture = math.multiply(ModuleRatingData.rating_data.Culture, array.val());
    var FoodDrinks = math.multiply(ModuleRatingData.rating_data.FoodDrinks, array.val());
    var Sports = math.multiply(ModuleRatingData.rating_data.Sports, array.val());
    var EducationTraining = math.multiply(ModuleRatingData.rating_data.EducationTraining, array.val());
    var Purchases = math.multiply(ModuleRatingData.rating_data.Purchases, array.val());
    var Music = math.multiply(ModuleRatingData.rating_data.Music, array.val());
    var Others = math.multiply(ModuleRatingData.rating_data.Others, array.val());
    var categories = [NightLife, Culture, FoodDrinks, Sports, EducationTraining, Purchases, Music, Others];

    var categories =  {
                        "NightLife": NightLife,
                        "Culture": Culture,
                        "FoodDrinks": FoodDrinks,
                        "Sports": Sports,
                        "EducationTraining": EducationTraining,
                        "Purchases": Purchases,
                        "Music": Music,
                        "Others": Others
                      };

    var valuesCategories = new Array();
    for(var key in categories) {
      valuesCategories.push(categories[key]);
    }
    var max_of_array = Math.max.apply(Math,valuesCategories);
    for(var key in categories){
      if(categories[key] == max_of_array){
        callback(key);
      }
    }
  });
}
