const mongoose = require('mongoose');
const PessoaSchema = require("../pessoa/schema");
const Schema   = mongoose.Schema;

const clienteSchema = new Schema({}, { discriminatorKey: 'tipo' });

module.exports = PessoaSchema.discriminator('Cliente', clienteSchema);
