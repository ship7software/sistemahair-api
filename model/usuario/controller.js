const Controller = require('../../lib/controller')
const usuarioFacade  = require('./facade')
const jwt = require('jsonwebtoken')

class UsuarioController extends Controller {}

const gerarToken = (res, usuario, secret) => {
    const token = jwt.sign(usuario, secret, {
        expiresIn: '1d'
    })
    res.status(200).json({ token: token, user: usuario })
}

UsuarioController.prototype.auth = (req, res, next) => {
    let filter = { login: req.body.login }
    let populate = { path: 'empresaId' }

    usuarioFacade.findOne(filter, populate)
    .then(usuario => {
        if(!usuario || !usuario.empresaId){
            res.status(401).json({ errorCode: 'INVALID_USER' })
            return
        }
        
        if(!usuario.verificarSenha(req.body.password)) {
            res.status(401).json({ errorCode: 'INVALID_USER' })
            return
        }
        
        if(!usuario.empresaId.contaConfirmada) {
            res.status(401).json({ errorCode: 'NOT_CONFIRMED' })
            return
        }        
        gerarToken(res, usuario, req.app.get('superSecret'))
    })
    .catch(err => next(err))    
}

UsuarioController.prototype.trocarSenha = (req, res, next) => {
    let filter = { login: req.body.login }
    let populate = { path: 'empresaId' }

    usuarioFacade.findOne(filter, populate)
    .then(usuario => {
        if(!usuario || !usuario.empresaId){
            res.status(422).json({ errorCode: 'INVALID_USER' })
            return
        }
        
        if(!usuario.verificarSenha(req.body.password)) {
            res.status(422).json({ errorCode: 'INVALID_USER' })
            return
        }
        
        if(!req.body.novaSenha || !req.body.confirmacaoSenha || req.body.novaSenha !== req.body.confirmacaoSenha) {
            res.status(422).json({ errorCode: 'INVALID_USER' })
            return
        }

        usuarioFacade.update({ _id: usuario._id }, { password: require('./../../lib/crypto').encrypt(req.body.novaSenha) }).then((u2) => {
            gerarToken(res, usuario, req.app.get('superSecret'))
        }).catch((err) => next(err))
    })
    .catch(err => next(err))    
}

UsuarioController.prototype.loginAutomatico = gerarToken

module.exports = new UsuarioController(usuarioFacade)
