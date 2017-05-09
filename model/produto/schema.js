const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const produtoSchema = new Schema({
  descricao: {
    type: String,
    required: true
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
    type: String
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  }
}, { collection: 'produtos' })

produtoSchema.index({empresaId: 1, descricao: 1}, {unique: true})

module.exports = mongoose.model('Produto', produtoSchema)
