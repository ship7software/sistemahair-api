const Controller = require('../../lib/controller')
const categoriaFacade  = require('./facade')

class CategoriaController extends Controller {}

module.exports = new CategoriaController(categoriaFacade)
