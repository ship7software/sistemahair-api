const Controller = require('../../lib/controller')
const fornecedorFacade  = require('./facade')

class FornecedorController extends Controller {}

module.exports = new FornecedorController(fornecedorFacade)
