const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const moment = require('moment')
const currencyFormatter = require('currency-formatter');

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
  preco: {
    type: Number,
    required: true,
    default: 0
  }
})

const comandaSchema = new Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
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
  status: {
    type: Number,
    default: 0
  }
}, {   
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  collection: 'comandas' 
})

comandaSchema.plugin(autopopulate)

comandaSchema.virtual('descricaoStatus').get(function() {
  const status = ['Aberto', 'Faturado', 'Cancelado', 'Faturamento Pendente']

  return status[this.status]
})

comandaSchema.virtual('nomeCliente').get(function() {
  return (this.clienteId || {}).nome
})

comandaSchema.virtual('dataAberturaFormatada').get(function() {
  return moment(this.dataAbertura).format('DD/MM/YYYY HH:mm')
})

comandaSchema.virtual('servicosConcatenados').get(function() {
  return (this.servicos || []).join(', ')
})

comandaSchema.virtual('precoFinalFormatado').get(function() {
  return currencyFormatter.format(this.precoFinal, { code: 'BRL', locale: 'pt-BR' })
})

module.exports = mongoose.model('Comanda', comandaSchema)
