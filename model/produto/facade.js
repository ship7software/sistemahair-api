const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class ProdutoFacade extends Facade {}

module.exports = new ProdutoFacade(Schema)
