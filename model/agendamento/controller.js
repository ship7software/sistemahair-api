let mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Controller = require('../../lib/controller')
const agendamentoFacade  = require('./facade')
const profissionalFacade = require('./../profissional/facade')
const _ = require('lodash')

class AgendamentoController extends Controller {}

AgendamentoController.prototype.montar = function(req, res, next) {
  let filtroProfissionais = { empresaId: new ObjectId(req.usuario.empresaId._id), ativo: true }
  let retorno = []
  let data = new Date(req.params.data)
  let proximo = new Date(data.valueOf())
  proximo.setDate(proximo.getDate() + 1)

  let filtroAgendas = { 
    empresaId: new ObjectId(req.usuario.empresaId._id), 
    ativo: true, 
    data: { $gte: data, $lt: proximo }
  }

  profissionalFacade.findWithPagination(filtroProfissionais, null, { nome: 1 }).then((profissionais) => {
    agendamentoFacade.findWithPagination(filtroAgendas, null, { horaInicio: 1 }).then((eventos) => {
      _(profissionais).forEach((profissional) => {
        retorno.push({
          profissional,
          agendas: _(eventos).filter(['profissionalId._id', profissional._id]),
          nome: profissional.nome,
          orderAgenda: _(eventos).filter(['profissionalId._id', profissional._id]).size() > 0 ? 0 : 1
        })
      })

      retorno = _.sortBy(retorno, ['orderAgenda', 'nome'])
      res.status(200).json(retorno)
    }).catch((err) => next(err))
  }).catch((err) => next(err))
}

module.exports = new AgendamentoController(agendamentoFacade)
