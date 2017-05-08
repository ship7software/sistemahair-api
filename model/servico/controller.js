const Controller = require('../../lib/controller');
const servicoFacade  = require('./facade');
const mongoose = require('mongoose');

class ServicoController extends Controller {}

module.exports = new ServicoController(servicoFacade);
