let db = require('./../resources/mongodb');

function doOperations(idx){
  if(idx < db.models.length){
    const modelName = db.models[idx];
    idx++;
    const facade = require('../model/' + modelName + '/facade');
    facade.bulkRemoveAll().then(doc => {
      facade.bulkInsert(db[modelName]).then(doOperations(idx)).catch(err => next(err));
    }).catch(err => next(err));
  }
}

let load = function(model){
  if(model && db[model]){
    db.models = [model];
  }
  doOperations(0);
}

module.exports = load;