const mongoose = require('mongoose');
const PessoaSchema = require("../pessoa/schema");
const Schema   = mongoose.Schema;

const profissionalSchema = new Schema({
  comissao: {
    type: Number,
    required: true,
    default: 0
  }
}, { discriminatorKey: 'tipo' });

module.exports = PessoaSchema.discriminator('Profissional', profissionalSchema);
