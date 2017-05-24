const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class ComandaFacade extends Facade {}

module.exports = new ComandaFacade(Schema)
