const Controller = require('../../lib/controller')
const servicoFacade  = require('./facade')

class ServicoController extends Controller {}

module.exports = new ServicoController(servicoFacade)
