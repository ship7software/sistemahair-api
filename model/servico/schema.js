const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const servicoSchema = new Schema({
  descricao: {
    type: String,
    required: true,
    uppercase: true
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
}, { 
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  collection: 'servicos' 
})

servicoSchema.index({empresaId: 1, descricao: 1}, {unique: true})

servicoSchema.virtual('duracaoPadraoVisual').get(function() {
  let desc = ''
  const horas = Math.floor(this.duracaoPadrao / 60)
  const minutos = this.duracaoPadrao % 60
  if(horas > 0)
    desc = desc.concat(horas, 'h ')
  if(minutos > 0)
    desc = desc.concat(minutos, 'm')

  return desc.trim()
})

module.exports = mongoose.model('Servico', servicoSchema)
