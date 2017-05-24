const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const Schema   = mongoose.Schema

const ProdutoComanda = new Schema({
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
  },
  precoUnitario: {
    type: Number,
    required: true,
    default: 0
  },
  valorItem: {
    type: Number,
    required: true,
    default: 0
  }
})

const ServicoComanda = new Schema({
  servicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico',
    required: true,
    autopopulate: true
  },
  profissionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profissional',
    required: true,
    autopopulate: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  precoUnitario: {
    type: Number,
    required: true,
    default: 0
  },
  valorItem: {
    type: Number,
    required: true,
    default: 0
  }
})

const comandaSchema = new Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico',
    required: true,
    autopopulate: true
  },
  dataAbertura: {
    type: Date,
    required: true,
    default: Date.now
  },
  dataFechamento: {
    type: Date
  },
  produtos: {
    type: [ProdutoComanda],
    default: []
  },
  servicos: {
    type: [ServicoComanda],
    default: []
  },
  precoTotal: {
    type: Number,
    required: true,
    default: 0
  },
  desconto: {
    type: Number,
    required: true,
    default: 0
  },
  precoFinal: {
    type: Number,
    required: true,
    default: 0
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
  }
}, { collection: 'comandas' })

comandaSchema.plugin(autopopulate)

comandaSchema.index({empresaId: 1, descricao: 1}, {unique: true})

module.exports = mongoose.model('Comanda', comandaSchema)
