const mongoose = require('mongoose')
const crypto = require('./../../lib/crypto')
const Schema   = mongoose.Schema

const usuarioSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nome: {
    type: String
  },
  fotoUrl: {
    type: String
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  }
})

usuarioSchema.index({empresaId: 1, login: 1}, {unique: true})

usuarioSchema.pre('save', function(next){
  console.log(this)
  var usuario = this
  if (!usuario.isModified('password')) return next()

  usuario.password = crypto.encrypt(usuario.password)
  next();
})

usuarioSchema.methods.verificarSenha = function(passToCheck) {
  return crypto.decrypt(this.password) == passToCheck
}

module.exports = mongoose.model('Usuario', usuarioSchema)
