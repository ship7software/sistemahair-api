const Controller = require('../../lib/controller')
const usuarioFacade = require('../usuario/facade')
const usuarioController = require('../usuario/controller')
const empresaFacade  = require('./facade')
const mongoose = require('mongoose')
const email = require('./../../lib/email')
const jwt = require('jsonwebtoken')

class EmpresaController extends Controller {}

var enviarEmailConfirmacao = function(req, empresa) {
    const token = jwt.sign({
        email: empresa.email,
        empresaId: empresa._id
    }, req.app.get('secretConfirmacao'), {
        expiresIn: '1d'
    })
        
    let config = req.app.get('config')
    console.log(config)
    let from = config.email.confirmacao.from
    let to = { email: empresa.email, name: empresa.nomeResponsavel }

    email.send(config, config.email.confirmacao.subject, from, to, config.email.confirmacao.template, {
        nome: empresa.nomeResponsavel,
        linkConfirmacao: (config.frontend.url || req.headers.origin) + '/confirmacao?token=' + token
    })

    return token    
}

EmpresaController.prototype.criar = (req, res, next) => {
    empresaFacade.create(req.body).then(empresa => {
        let usuario = {
            login: empresa.email,
            password: req.body.password,
            nome: empresa.nomeResponsavel,
            empresaId: mongoose.Types.ObjectId(empresa._id)
        }

        usuarioFacade.create(usuario).then(doc => {
            let token = enviarEmailConfirmacao(req, empresa)
            let retorno = Object.assign({}, doc._doc, { tokenConfirmacao: token })

            res.status(201).send(retorno)
        })
        .catch(err => {
            empresaFacade.remove(empresa._id).then(() => {
                next(err)
            })
        })

    }).catch(err => next(err))
}

EmpresaController.prototype.reenviarConfirmacao = (req, res, next) => {
    empresaFacade.findOne({ email: req.query.email }).then((empresa) => {
        if(empresa) {
            let token = enviarEmailConfirmacao(req, empresa)
            let retorno = Object.assign({}, empresa._doc, { tokenConfirmacao: token })
            
            res.status(200).json(retorno)
        } else {
            res.status(404).json({ mensagem: 'Email não encontrado'})
        }
    }).catch(err => res.status(404).json(err))
}

EmpresaController.prototype.confirmar = (req, res, next) => {
    let secret = req.app.get('config').secretConfirmacao
    jwt.verify(req.query.token, secret, function(err, decoded){
        if(err){
            res.status(401).json({ message: 'Invalid or expired token' })
            return
        }

        empresaFacade.update({ email: decoded.email }, { contaConfirmada: true }).then(() => {
            usuarioFacade.findOne({ login: decoded.email }, { path: 'empresaId' }).then(doc => {
                if(!doc){
                    res.status(401).json({ message: 'Invalid or expired token 1' })
                    return
                }

                usuarioController.loginAutomatico(res, doc, req.app.get('superSecret'))

            }).catch((err) => {
                console.log(err)
                res.status(200).json()
            })            
        }).catch(() => {
            res.status(401).json({ message: 'Invalid or expired token 2' })
        })
    })
}

module.exports = new EmpresaController(empresaFacade)
