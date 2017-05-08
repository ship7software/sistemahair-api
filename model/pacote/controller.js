const Controller = require('../../lib/controller');
const pacoteFacade  = require('./facade');
const mongoose = require('mongoose');

class PacoteController extends Controller {}

module.exports = new PacoteController(pacoteFacade);
