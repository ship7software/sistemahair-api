const Controller = require('../../lib/controller');
const usuarioFacade  = require('./facade');
const jwt = require('jsonwebtoken');

class UsuarioController extends Controller {}

const gerarToken = (usuario, secret, cb) => {
    const token = jwt.sign({
            type: 'user',
            obj: usuario
        }, secret, {
        expiresIn: '1d'
    });
    
    cb({ token: token });
}

UsuarioController.prototype.auth = (req, res, next) => {
    usuarioFacade.findOne({ login: req.body.login })
    .then(usuario => {
        if(!usuario){
            res.status(401).json({ errorCode: 'INVALID_USER' });
            return;
        }
        usuario.verificarSenha(req.body.password, (err, senhaEstaCorreta) => {
            if(err){
                next(err);
                return;
            }

            if(!senhaEstaCorreta) {
                res.status(401).json({ errorCode: 'INVALID_PASSWORD' });
                return;
            }
            gerarToken(usuario, req.app.get('superSecret'), function(response){
                    res.status(200).json(response);
                });
            });
    })
    .catch(err => next(err));    
};

module.exports = new UsuarioController(usuarioFacade);
