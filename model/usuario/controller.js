const Controller = require('../../lib/controller')
const usuarioFacade  = require('./facade')
const jwt = require('jsonwebtoken')

class UsuarioController extends Controller {}

const gerarToken = (usuario, secret, cb) => {
    const token = jwt.sign(usuario, secret, {
        expiresIn: '1d'
    })
    
    cb({ token: token, user: usuario })
}

UsuarioController.prototype.auth = (req, res, next) => {
    let filter = { login: req.body.login }
    let populate = { path: 'empresaId' }

    if(req.hostname == 'app') {
        populate.match = { $or: [
            { subdominio: req.hostname },
            { email: req.body.login }
        ]}
    } else {
        populate.match = { subdominio: req.hostname }
    }

    usuarioFacade.findOne(filter, populate)
    .then(usuario => {
        if(!usuario || !usuario.empresaId){
            res.status(401).json({ errorCode: 'INVALID_USER' })
            return
        }
        
        if(!usuario.verificarSenha(req.body.password)) {
            res.status(401).json({ errorCode: 'INVALID_PASSWORD' })
            return
        }
        gerarToken(usuario, req.app.get('superSecret'), function(response){
            res.status(200).json(response)
        })
    })
    .catch(err => next(err))    
}

module.exports = new UsuarioController(usuarioFacade)
