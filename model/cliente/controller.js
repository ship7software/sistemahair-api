const Controller = require('../../lib/controller')
const clienteFacade  = require('./facade')

class ClienteController extends Controller {}

module.exports = new ClienteController(clienteFacade)
