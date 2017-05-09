const mongoose   = require('mongoose')
let db           = require('./../resources/mongodb')

mongoose.set('debug', false)

let empresaB = {
  email: 'local.superhair@mailinator.com',
  nome: 'Local',
  subdominio: 'localhost',
  telefone: '(31) 99197-5067',
  estado: 'MG',
  cidade: 'Montes Claros'
}

function doOperations(idx, id, cb){
  if(idx < db.models.length){
    const modelName = db.models[idx]
    idx++
    const facade = require('./../model/' + modelName + '/facade')
    facade.bulkRemoveAll().then(() => {
      for (var index = 0; index < db[modelName].length; index++) {
        db[modelName][index].empresaId = id
      }
      facade.bulkInsert(db[modelName]).then(doOperations(idx, id, cb)).catch(err => cb(err))
    }).catch(err => cb(err))
  } else {
    cb()
  }
}

let load = function(id, cb){
  doOperations(0, id, cb)
}

let empresaFacade = require('./../model/empresa/facade')

var populate = function(cb){
  
  empresaFacade.findOne({ email: empresaB.email }).then(doc => {
    if(!doc){
      empresaFacade.create(empresaB).then(doc => {
          let usuarioB = {
              login: empresaB.email,
              password: '123456@',
              nome: empresaB.nome,
              marca: empresaB.subdominio,
              empresaId: mongoose.Types.ObjectId(doc._id)
          }

          require('./../model/usuario/facade').create(usuarioB)
            .then(doc => load(mongoose.Types.ObjectId(doc._id), cb))
            .catch(err => cb(err))

      }).catch(err => cb(err))
    } else {
      load(mongoose.Types.ObjectId(doc._id), cb)
    }
  })
}

module.exports = populate