const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const servicoSchema = new Schema({
  descricao: {
    type: String,
    required: true,
    unique: true
  },
  preco: {
    type: Number
  },
  ativo: {
    type: Boolean,
    required: true,
    default: true
  },
  comissao: {
    type: Number
  },
  duracaoPadrao: {
    type: Number
  }
}, { collection: 'servicos' });

module.exports = mongoose.model('Servico', servicoSchema);
