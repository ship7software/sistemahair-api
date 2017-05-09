const Controller = require('../../lib/controller')
const formaPagamentoFacade  = require('./facade')

class FormaPagamentoController extends Controller {}

module.exports = new FormaPagamentoController(formaPagamentoFacade)
