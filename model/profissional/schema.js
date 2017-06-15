const mongoose = require('mongoose')
const PessoaSchema = require('../pessoa/schema')
const Schema   = mongoose.Schema

const horarioTrabalhoSchema = new Schema({
  horaInicio: {
    type: String
  }
})

const profissionalSchema = new Schema({
  comissao: {
    type: Number,
    required: true,
    default: 0
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  },
  horarios: {
    type: [[String,String]]
  },
  habilidades: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Servico',
    autopopulate: true
  }
}, { discriminatorKey: 'tipo' })

module.exports = PessoaSchema.discriminator('Profissional', profissionalSchema)
