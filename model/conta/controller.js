const Controller = require('../../lib/controller');
const contaFacade  = require('./facade');
const mongoose = require('mongoose');

class ContaController extends Controller {}

module.exports = new ContaController(contaFacade);
