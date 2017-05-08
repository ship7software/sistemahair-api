const Facade = require('../../lib/facade');
const Schema  = require('./schema');

class ServicoFacade extends Facade {}

module.exports = new ServicoFacade(Schema);
