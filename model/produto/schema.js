const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const produtoSchema = new Schema({
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
  custo: {
    type: Number
  },
  estoque: {
    type: Number
  },
  codigoBarra: {
    type: String,
    unique: true,
    sparse: true
  }
}, { collection: 'produtos' });

module.exports = mongoose.model('Produto', produtoSchema);
