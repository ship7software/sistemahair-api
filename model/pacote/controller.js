const Controller = require('../../lib/controller')
const pacoteFacade  = require('./facade')

class PacoteController extends Controller {}

module.exports = new PacoteController(pacoteFacade)
