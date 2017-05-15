const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const empresaSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },  
  nome: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true,
    unique: true
  },
  logoUrl: {
    type: String
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
    type: String,
    required: true,
    uppercase: true
  },
  cidade: {
    type: String,
    required: true,
    uppercase: true
  },
  cpfCnpj: {
    type: String
  },
  razaoSocial: {
    type: String,
    uppercase: true
  },
  inscricaoMunicipal: {
    type: String
  },
  inscricaoEstadual: {
    type: String
  },
  celular: {
    type: String
  },
  nomeResponsavel: {
    type: String,
    uppercase: true,
    required: true
  },
  contaConfirmada: {
    type: Boolean,
    required: true,
    default: false
  }
})

module.exports = mongoose.model('Empresa', empresaSchema)
