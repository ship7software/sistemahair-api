const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class FornecedorFacade extends Facade {}

module.exports = new FornecedorFacade(Schema)
