const Controller = require('../../lib/controller')
const produtoFacade  = require('./facade')

class ProdutoController extends Controller {}

module.exports = new ProdutoController(produtoFacade)
