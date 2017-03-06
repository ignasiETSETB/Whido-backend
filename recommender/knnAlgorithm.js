const jwt = require('jwt-simple');
const math = require('mathjs');

exports.knn = function (profileArray, events, similarityFactor, callback) {

/**** KNN ALGORITHM VARIABLE INITIALIZATION ****/

  if(typeof(similarityFactor) !== 'undefined'){
      console.log("SIMILARITY FACTOR DEFINED");
  } else{
      var similarityFactor = 0.7;
  }


  var vectorDim = 24;     // Vector Dimension of the profileArray vector
  var MaxDist = 4;        // Maximum separation/distance between the elements of the compared vectors

  var normFactor = vectorDim * MaxDist;        // The normalization factor
  //console.log("normFactor: "+ normFactor);

  var aux;                //Aux and total are auxiliary variables for the KNN
  var total = 0;

  var result;             //Stores the final similarity value for each iteration
  var event = {};         //Stores the new eventObject with it's similarity value for each iteration
  var results = [];       //Stores all the events with their similarity property already computed


  /**** KNN ALGORITHM IMPLEMENTATION ****/

  // For each event
  for (j = 0; j < events.length; j++) {

      // knn algorithm , calculates the similarity between the user & this event
      for (i = 0; i < profileArray.length; i++) {
          aux = (profileArray[i] - events[j].profileArray[i]) * (profileArray[i] - events[j].profileArray[i]);
          aux = Math.sqrt(aux);
          total = total + aux;
      }

      // We calculate the similarity as one minus the result
      // Normalize the result by dividing the final result by the normalization factor
      result = 1 - (total / normFactor);


      // Add the similarity property (result) to the event object
      events[j].similarity = result;
      //console.log(JSON.stringify(events[j], null, 4));  //Prints the whole object

      total = 0;

      // Put this element inside results array to later sort it by similarity
      results.push(events[j]);
  }

  /**** RESULT SORTING ****/

  // Sort the array results (by similarity)
  results.sort(function (a, b) {
      if (a.similarity <= b.similarity) {
          return 1;
      }
      if (a.similarity > b.similarity) {
          return -1;
      }
      // a must be equal to b
      //return 0;
  });

/**** STRICTER SIMILARITY CHECK ****/

  var strictResults = [];

  for (i = 0; i < results.length; i++) {
      // If the event's similarity is greater or equal than the factor required put it in the array
      if (results[i].similarity >= similarityFactor) {
          strictResults.push(results[i]);
      }
  }
  results = strictResults;

  callback(results);
};
