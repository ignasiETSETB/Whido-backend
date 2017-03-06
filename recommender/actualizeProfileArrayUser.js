const math = require('mathjs')
const norm = require('./normalizeArray')
const features = require('./features')

module.exports = function (rating, idUser, vectorUser, vectorEvent) {
  //userProfileArray = userProfileArray + (rating)*eventProfileArray
  newUserProfileArrayNormalized = norm(math.add(vectorUser.val(), math.multiply(vectorEvent.val(), rating)));

  //actualitzem el vector del usuari
  //warning: quan fas servir el saveProfileUser firebase es queixa pq hauríem d'utilitzar .set() enlloc de el .update()
  features.saveProfileUser(idUser, newUserProfileArrayNormalized);
  
  return newUserProfileArrayNormalized;

};
