const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const categoriaSchema = new Schema({
  descricao: {
    type: String,
    required: true,
    unique: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['C', 'D']
  },
  ativo: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
