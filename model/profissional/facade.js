const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class ProfissionalFacade extends Facade {}

module.exports = new ProfissionalFacade(Schema)
