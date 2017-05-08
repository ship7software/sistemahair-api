const Controller = require('../../lib/controller');
const profissionalFacade  = require('./facade');
const mongoose = require('mongoose');

class ProfissionalController extends Controller {}

module.exports = new ProfissionalController(profissionalFacade);
