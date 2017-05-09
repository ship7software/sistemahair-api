const Controller = require('../../lib/controller')
const profissionalFacade  = require('./facade')

class ProfissionalController extends Controller {}

module.exports = new ProfissionalController(profissionalFacade)
