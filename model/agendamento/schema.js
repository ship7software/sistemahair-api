const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const moment   = require('moment')
const autopopulate = require('mongoose-autopopulate')

const agendamentoSchema = new Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
    autopopulate: true
  },
  profissionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profissional',
    required: true,
    autopopulate: true
  },  
  servicos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Servico',
    required: true,
    autopopulate: true
  },
  data: {
    type: Date,
    required: true,
    default: Date.now
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaFim: {
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
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
  }
})

agendamentoSchema.virtual('dataHora').get(function () {
  return moment(moment(this.data).format("YYYY-MM-DD ") + this.horaInicio)
})

agendamentoSchema.plugin(autopopulate)

module.exports = mongoose.model('Agendamento', agendamentoSchema)
