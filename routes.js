const Router = require('express').Router;
const jwt = require('jsonwebtoken');

const router = new Router();

const usuario  = require('./model/usuario/router');
const empresa  = require('./model/empresa/router');
const conta  = require('./model/conta/router');
const categoria  = require('./model/categoria/router');
const formaPagamento  = require('./model/formaPagamento/router');

const produto  = require('./model/produto/router');
const servico  = require('./model/servico/router');
const pacote  = require('./model/pacote/router');
const pessoa  = require('./model/pessoa/router');
const cliente  = require('./model/cliente/router');
const fornecedor  = require('./model/fornecedor/router');
const profissional  = require('./model/profissional/router');

const empresaController = require('./model/empresa/controller');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to sistemahair-api API!' });
});

router.route('/protegido').get((req, res) => {
  res.json({ mensagem: 'OK' });
});

router.route('/protegido').post((req, res) => {
  res.json({ mensagem: 'OK' });
});

router.use('/usuario', usuario);
router.use('/empresa', empresa);
router.use('/conta', conta);
router.use('/categoria', categoria);
router.use('/formaPagamento', formaPagamento);
router.use('/produto', produto);
router.use('/servico', servico);
router.use('/pacote', pacote);
router.use('/pessoa', pessoa);
router.use('/cliente', cliente);
router.use('/fornecedor', fornecedor);
router.use('/profissional', profissional);

router.route('/publico/empresa/criar').post((...args) => empresaController.criar(...args));

module.exports = router;
