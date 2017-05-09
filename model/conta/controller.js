const Controller = require('../../lib/controller')
const contaFacade  = require('./facade')

class ContaController extends Controller {}

module.exports = new ContaController(contaFacade)
