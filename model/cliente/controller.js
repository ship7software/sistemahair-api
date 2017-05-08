const Controller = require('../../lib/controller');
const clienteFacade  = require('./facade');
const mongoose = require('mongoose');

class ClienteController extends Controller {}

module.exports = new ClienteController(clienteFacade);
