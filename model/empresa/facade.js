const Facade = require('../../lib/facade');
const Schema  = require('./schema');

class EmpresaFacade extends Facade {}

module.exports = new EmpresaFacade(Schema);
