const Controller = require('../../lib/controller');
const pessoaFacade  = require('./facade');
const mongoose = require('mongoose');

class PessoaController extends Controller {}

module.exports = new PessoaController(pessoaFacade);
