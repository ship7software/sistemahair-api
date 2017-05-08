const Facade = require('../../lib/facade');
const Schema  = require('./schema');

class ClienteFacade extends Facade {}

module.exports = new ClienteFacade(Schema);
