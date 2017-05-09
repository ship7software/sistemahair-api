process.env.NODE_ENV = 'test'
require('colors')
require('./../index')
const mongoose   = require('mongoose')
let db           = require('./../resources/mongodb')

mongoose.set('debug', false)

console.log('Iniciando preparo do ambiente de Teste'.yellow)

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
    console.log(('Iniciando exclusão ' + modelName).yellow)
    facade.bulkRemoveAll().then(() => {
      console.log(('Finalizada exclusão ' + modelName).green)
      for (var index = 0; index < db[modelName].length; index++) {
        db[modelName][index].empresaId = id
      }
      console.log(('Iniciando inserção ' + modelName).yellow)
      facade.bulkInsert(db[modelName]).then(() => { 
        console.log(('Finalizada inserção ' + modelName).green)
        doOperations(idx, id, cb)
      }).catch(err => { cb(err) })
    }).catch(err => { cb(err) })
  } else {
    cb()
  }
}

let load = function(id, cb){
  doOperations(0, id, cb)
}

let empresaFacade = require('./../model/empresa/facade')
let usuarioFacade = require('./../model/usuario/facade')

var cb = function(err){
  if(err){
    console.log('Ocorreu um erro: '.red)
    console.log(err)
  } else {
    console.log('Processo Finalizado com sucesso'.green)        
    process.exit(0)
  }
}
console.log('Verificando empresa padrão'.yellow)

empresaFacade.bulkRemoveAll().then(() => {
  usuarioFacade.bulkRemoveAll().then(() => {
    empresaFacade.create(empresaB).then(doc => {

        console.log(('Empresa padrão inserida ' + doc._id).green)
        let empresaId = mongoose.Types.ObjectId(doc._id)
        let usuarioB = {
            login: empresaB.email,
            password: '123456@',
            nome: empresaB.nome,
            marca: empresaB.subdominio,
            empresaId: empresaId
        }

        console.log('Inserindo usuário padrão'.yellow)
        usuarioFacade.create(usuarioB)
        .then(doc => { 
          console.log(('Usuário padrão inserido ' + doc._id).green)
          load(empresaId, cb) 
        })
        .catch(err => { cb(err) })
    }).catch(err => { cb(err) })
  }).catch(err => { cb(err) })
}).catch(err => { cb(err) })