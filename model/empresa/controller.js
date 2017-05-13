const Controller = require('../../lib/controller')
const usuarioFacade = require('../usuario/facade')
const empresaFacade  = require('./facade')
const mongoose = require('mongoose')
const email = require('./../../lib/email')
const jwt = require('jsonwebtoken')

class EmpresaController extends Controller {}

EmpresaController.prototype.criar = (req, res, next) => {
    let config = req.app.get('config')
    empresaFacade.create(req.body).then(empresa => {
        let usuario = {
            login: empresa.email,
            password: req.body.password,
            nome: empresa.nomeResponsavel,
            marca: empresa.subdominio,
            empresaId: mongoose.Types.ObjectId(empresa._id)
        }

        usuarioFacade.create(usuario).then(doc => {
            const token = jwt.sign({
                email: empresa.email,
                usuarioId: usuario._id,
                empresaId: empresa._id
            }, req.app.get('superSecret'), {
                expiresIn: '1d'
            })
            let from = config.email.confirmacao.from
            let to = { email: empresa.email, name: empresa.nomeResponsavel }
            
            email.send(config, config.email.confirmacao.subject, from, to, config.email.confirmacao.template, {
                nome: empresa.nomeResponsavel,
                linkConfirmacao: (req.headers.origin || config.frontend.url) + '/confirmacao?token=' + token
            })
            res.status(201).send(doc)
        })
        .catch(err => {
            empresaFacade.remove(empresa._id).then(() => {
                next(err)
            })
        })

    }).catch(err => next(err))
}

module.exports = new EmpresaController(empresaFacade)
