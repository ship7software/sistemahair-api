const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class ContaFacade extends Facade {}

module.exports = new ContaFacade(Schema)
