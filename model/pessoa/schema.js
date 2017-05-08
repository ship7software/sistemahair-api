const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const pessoaSchema = new Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  cpfCnpj: {
    type: String,
    unique: true,
    sparse: true
  },
  telefone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
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
  razaoSocial: {
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
  }
}, { discriminatorKey: 'tipo' });

module.exports = mongoose.model('Pessoa', pessoaSchema);
