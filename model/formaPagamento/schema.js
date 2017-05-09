const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const formaPagamentoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  ativo: {
    type: Boolean,
    required: true,
    default: true
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  }
}, { collection: 'formasPagamento' })

formaPagamentoSchema.index({empresaId: 1, nome: 1}, {unique: true})

module.exports = mongoose.model('FormaPagamento', formaPagamentoSchema)
