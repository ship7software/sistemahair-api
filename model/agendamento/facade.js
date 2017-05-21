const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class AgendamentoFacade extends Facade {}

module.exports = new AgendamentoFacade(Schema)
