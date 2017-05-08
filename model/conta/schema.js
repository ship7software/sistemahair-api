const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const contaSchema = new Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  ativo: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model('Conta', contaSchema);
