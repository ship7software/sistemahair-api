const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class CategoriaFacade extends Facade {}

module.exports = new CategoriaFacade(Schema)
