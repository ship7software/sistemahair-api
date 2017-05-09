const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const formaPagamentoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  taxa: {
    type: Number,
    required: true,
    default: 0
  },
  prazoRecebimento: {
    type: Number,
    required: true,
    default: 0
  },  
  tipoBaixa: {
    type: String,
    required: true,
    default: 'M',
    enum: ['A', 'M']
  },
  contaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta'
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
}, { 
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  collection: 'formasPagamento'
})

formaPagamentoSchema.index({empresaId: 1, nome: 1}, {unique: true})

formaPagamentoSchema.virtual('descricaoBaixa').get(function() {
  if(this.tipoBaixa == 'A')
    return 'Automática'
  return 'Manual'
});

module.exports = mongoose.model('FormaPagamento', formaPagamentoSchema)
