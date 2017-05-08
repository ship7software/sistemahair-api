const Controller = require('../../lib/controller');
const formaPagamentoFacade  = require('./facade');
const mongoose = require('mongoose');

class FormaPagamentoController extends Controller {}

module.exports = new FormaPagamentoController(formaPagamentoFacade);
