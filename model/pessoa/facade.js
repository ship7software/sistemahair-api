const Facade = require('../../lib/facade');
const Schema  = require('./schema');

class PessoaFacade extends Facade {}

module.exports = new PessoaFacade(Schema);
