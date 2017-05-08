const Controller = require('../../lib/controller');
const fornecedorFacade  = require('./facade');
const mongoose = require('mongoose');

class FornecedorController extends Controller {}

module.exports = new FornecedorController(fornecedorFacade);
