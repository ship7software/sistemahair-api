const Controller = require('../../lib/controller');
const produtoFacade  = require('./facade');
const mongoose = require('mongoose');

class ProdutoController extends Controller {}

module.exports = new ProdutoController(produtoFacade);
