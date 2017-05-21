const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const moment   = require('moment')

const agendamentoSchema = new Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  profissionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profissional',
    required: true
  },  
  servicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico',
    required: true
  },
  data: {
    type: Date,
    required: true,
    default: Date.now
  },
  hora: {
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
  return moment(moment(this.data).format("YYYY-MM-DD ") + this.hora)
})

agendamentoSchema.index({empresaId: 1, nome: 1}, {unique: true})

module.exports = mongoose.model('Agendamento', agendamentoSchema)
