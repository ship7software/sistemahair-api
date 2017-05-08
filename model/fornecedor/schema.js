const mongoose = require('mongoose');
const PessoaSchema = require("../pessoa/schema");
const Schema   = mongoose.Schema;

const fornecedorSchema = new Schema({}, { discriminatorKey: 'tipo' });

module.exports = PessoaSchema.discriminator('Fornecedor', fornecedorSchema);
