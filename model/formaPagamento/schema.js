const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const formaPagamentoSchema = new Schema({
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
}, { collection: 'formasPagamento' });

module.exports = mongoose.model('FormaPagamento', formaPagamentoSchema);
