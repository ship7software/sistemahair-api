const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const pessoaSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  cpfCnpj: {
    type: String,
    sparse: true
  },
  telefone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  razaoSocial: {
    type: String
  },
  inscricaoEstadual: {
    type: String
  },
  inscricaoMunicipal: {
    type: String
  },
  nomeResponsavel: {
    type: String
  },
  dataNascimento: {
    type: Date
  },
  cep: {
    type: String
  },
  logradouro: {
    type: String
  },
  numeroEndereco: {
    type: String
  },
  complemento: {
    type: String
  },
  bairro: {
    type: String
  },
  estado: {
    type: String
  },
  cidade: {
    type: String
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

pessoaSchema.index({empresaId: 1, email: 1}, {unique: true, sparse: true})
pessoaSchema.index({empresaId: 1, cpfCnpj: 1}, {unique: true, sparse: true})
pessoaSchema.index({empresaId: 1, telefone: 1}, {unique: true, sparse: true})

module.exports = mongoose.model('Pessoa', pessoaSchema)
