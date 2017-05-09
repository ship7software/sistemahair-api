const Facade = require('../../lib/facade')
const Schema  = require('./schema')

class UsuarioFacade extends Facade {}

module.exports = new UsuarioFacade(Schema)
