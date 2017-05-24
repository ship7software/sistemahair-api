const Controller = require('../../lib/controller')
const comandaFacade  = require('./facade')

class ComandaController extends Controller {}

module.exports = new ComandaController(comandaFacade)
