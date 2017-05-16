const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const pessoaSchema = new Schema({
  nome: {
    type: String,
    required: true,
    uppercase: true
  },
  cpfCnpj: {
    type: String
  },
  telefone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  razaoSocial: {
    type: String,
    uppercase: true
  },
  inscricaoEstadual: {
    type: String
  },
  inscricaoMunicipal: {
    type: String
  },
  nomeResponsavel: {
    type: String,
    uppercase: true
  },
  dataNascimento: {
    type: Date
  },
  cep: {
    type: String
  },
  logradouro: {
    type: String,
    uppercase: true
  },
  numeroEndereco: {
    type: String,
    uppercase: true
  },
  complemento: {
    type: String,
    uppercase: true
  },
  bairro: {
    type: String,
    uppercase: true
  },
  estado: {
    type: String
  },
  cidade: {
    type: String,
    uppercase: true
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
}, { discriminatorKey: 'tipo' })

pessoaSchema.index({empresaId: 1, tipo: 1, email: 1}, {sparse: true})
pessoaSchema.index({empresaId: 1, tipo: 1, cpfCnpj: 1}, {sparse: true})
pessoaSchema.index({empresaId: 1, tipo: 1, telefone: 1}, {unique: true, sparse: true})

module.exports = mongoose.model('Pessoa', pessoaSchema)
