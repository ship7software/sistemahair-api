const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class PacoteFacade extends Facade {}

module.exports = new PacoteFacade(Schema)
