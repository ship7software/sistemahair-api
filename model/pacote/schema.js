const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ProdutoPacote = new Schema({
  idProduto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produto",
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
});

const ServicoPacote = new Schema({
  idServico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Servico",
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
});

const pacoteSchema = new Schema({
  descricao: {
    type: String,
    required: true,
    unique: true
  },
  dataInicio: {
    type: Date,
    required: true,
    default: Date.now
  },
  dataFim: {
    type: Date
  },
  produtos: {
    type: [ProdutoPacote],
    default: []
  },
  servicos: {
    type: [ServicoPacote],
    default: []
  }
}, { collection: 'pacotes' });

module.exports = mongoose.model('Pacote', pacoteSchema);
