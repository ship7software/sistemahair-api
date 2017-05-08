const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema   = mongoose.Schema;
const SALT_WORK_FACTOR = 10;


const usuarioSchema = new Schema({
  marca: {
    type: String,
    required: true
  },  
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
    ref: "Empresa",
    required: true
  },
});

usuarioSchema.index({empresaId: 1, login: 1}, {unique: true});
usuarioSchema.index({marca: 1, login: 1}, {unique: true});

usuarioSchema.pre('save', function(next){
  var usuario = this;
  if (!usuario.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(usuario.password, salt, function(err, hash) {
      if (err) return next(err);
      usuario.password = hash;
      next();
    });
  });
});

usuarioSchema.methods.verificarSenha = function(passToCheck, cb) {
  bcrypt.compare(passToCheck, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });  
};

module.exports = mongoose.model('Usuario', usuarioSchema);
