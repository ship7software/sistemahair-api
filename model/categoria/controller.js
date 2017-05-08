const Controller = require('../../lib/controller');
const categoriaFacade  = require('./facade');
const mongoose = require('mongoose');

class CategoriaController extends Controller {}

module.exports = new CategoriaController(categoriaFacade);
