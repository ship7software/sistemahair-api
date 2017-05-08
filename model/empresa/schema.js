const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

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
    type: String,
    required: true
  },
  cidade: {
    type: String,
    required: true
  },
  cpfCnpj: {
    type: String
  },
  razaoSocial: {
    type: String
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
  responsavel: {
    type: String
  },
  subdominio: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Empresa', empresaSchema);
