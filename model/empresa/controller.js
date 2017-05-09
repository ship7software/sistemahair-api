const Controller = require('../../lib/controller')
const usuarioFacade = require('../usuario/facade')
const empresaFacade  = require('./facade')
const mongoose = require('mongoose')

class EmpresaController extends Controller {}

EmpresaController.prototype.criar = (req, res, next) => {
    empresaFacade.create(req.body).then(empresa => {
        let usuario = {
            login: empresa.email,
            password: req.body.password,
            nome: empresa.nome,
            marca: empresa.subdominio,
            empresaId: mongoose.Types.ObjectId(empresa._id)
        }

        usuarioFacade.create(usuario).then(doc => res.status(201).send(doc))
        .catch(err => {
            empresaFacade.remove(empresa._id).then(() => {
                next(err)
            })
        })

    }).catch(err => next(err))
}

module.exports = new EmpresaController(empresaFacade)
