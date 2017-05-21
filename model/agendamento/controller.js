const Controller = require('../../lib/controller')
const agendamentoFacade  = require('./facade')

class AgendamentoController extends Controller {}

module.exports = new AgendamentoController(agendamentoFacade)
