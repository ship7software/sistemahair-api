const Controller = require('../../lib/controller')
const comandaFacade = require('./facade')
const agendaFacade = require('./../agendamento/facade')
const moment = require('moment')
let mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
class ComandaController extends Controller {}

ComandaController.prototype.abrir = (req, res, next) => {
  const hoje = moment(req.query.data).startOf('day')
  const amanha = moment(hoje).add(1, 'days')
  let empresaId = new ObjectId(req.usuario.empresaId._id)

  let filter = {
    clienteId: req.params.clienteId,
    data: {
      $gte: hoje.toDate(),
      $lt: amanha.toDate()
    }
  }
  agendaFacade.find(filter).then((ret) => {
    let servicos = []
    let precoTotal = 0
    let agendas = []

    for (let index = 0; index < ret.length; index++) {
      let element = ret[index]
      agendas.push(element._id)

      for (var j = 0; j < element.servicos.length; j++) {
        let agenda = element.servicos[j]
        precoTotal += (agenda.preco || 0)

        servicos.push({
          servicoId: agenda.id,
          precoUnitario: (agenda.preco || 0),
          profissionalId: element.profissionalId.id
        }) 
      }
    }

    let comanda = {
     clienteId: req.params.clienteId,
     dataAbertura: new Date(),
     servicos: servicos,
     produtos: [],
     precoTotal: precoTotal,
     precoFinal: precoTotal,
     empresaId: empresaId
    }

    comandaFacade.create(comanda)
    .then(doc => { 
      agendaFacade.update({ _id: { $in: agendas }}, { comandaId: doc._id })
      .then(ret2 => {
        console.log(ret2)
        res.status(201).json(doc)
      })
      .catch(err => next(err))
    })
    .catch(err => next(err))
  }).catch(err => next(err))
}

module.exports = new ComandaController(comandaFacade)
