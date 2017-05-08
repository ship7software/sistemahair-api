const Facade = require('../../lib/facade');
const Schema  = require('./schema');

class FormaPagamentoFacade extends Facade {}

module.exports = new FormaPagamentoFacade(Schema);
