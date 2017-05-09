const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const servicoSchema = new Schema({
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
  comissao: {
    type: Number
  },
  duracaoPadrao: {
    type: Number
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  }
}, { collection: 'servicos' })

servicoSchema.index({empresaId: 1, descricao: 1}, {unique: true})

module.exports = mongoose.model('Servico', servicoSchema)
