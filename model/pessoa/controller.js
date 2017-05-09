const Controller = require('../../lib/controller')
const pessoaFacade  = require('./facade')

class PessoaController extends Controller {}

module.exports = new PessoaController(pessoaFacade)
