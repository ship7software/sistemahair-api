const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const categoriaSchema = new Schema({
  descricao: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['C', 'D']
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
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

categoriaSchema.index({empresaId: 1, descricao: 1}, {unique: true})

categoriaSchema.virtual('descricaoTipo').get(function() {
  if(this.tipo == 'C')
    return 'Crédito'
  return 'Débito'
});

module.exports = mongoose.model('Categoria', categoriaSchema)
