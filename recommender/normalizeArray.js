const math = require('mathjs')

module.exports = function (vector) {

  var aux = 0;
  //aux serà la norma del vector
  for(i = 0; i < vector.length ; i++){
    aux = aux+(vector[i]*vector[i]); // no funciona vector[i]^2
  }

  var fraction = 1/(math.sqrt(aux));
  var vectorNorm = math.multiply(vector,fraction);

  return vectorNorm;

};
