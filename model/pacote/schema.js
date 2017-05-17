const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const Schema   = mongoose.Schema

const ProdutoPacote = new Schema({
  produtoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true,
    autopopulate: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
})

const ServicoPacote = new Schema({
  servicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico',
    required: true,
    autopopulate: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
})

const pacoteSchema = new Schema({
  descricao: {
    type: String,
    required: true,
    uppercase: true
  },
  dataInicio: {
    type: Date,
    required: true,
    default: Date.now
  },
  dataFim: {
    type: Date
  },
  produtos: {
    type: [ProdutoPacote],
    default: []
  },
  servicos: {
    type: [ServicoPacote],
    default: []
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
    autopopulate: true
  },
  ativo: {
    type: Boolean,
    required: true,
    default: true
  },  
  preco: {
    type: Number
  }
}, { collection: 'pacotes' })

pacoteSchema.plugin(autopopulate)

pacoteSchema.index({empresaId: 1, descricao: 1}, {unique: true})

module.exports = mongoose.model('Pacote', pacoteSchema)
