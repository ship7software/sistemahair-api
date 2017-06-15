const Router = require('express').Router
const cep = require('busca-cep')

const router = new Router()

const usuario  = require('./model/usuario/router')
const empresa  = require('./model/empresa/router')
const conta  = require('./model/conta/router')
const categoria  = require('./model/categoria/router')
const formaPagamento  = require('./model/formaPagamento/router')
const agendamento = require('./model/agendamento/router')
const produto  = require('./model/produto/router')
const servico  = require('./model/servico/router')
const pacote  = require('./model/pacote/router')
const pessoa  = require('./model/pessoa/router')
const cliente  = require('./model/cliente/router')
const fornecedor  = require('./model/fornecedor/router')
const profissional  = require('./model/profissional/router')
const comanda  = require('./model/comanda/router')

const empresaController = require('./model/empresa/controller')

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to sistemahair-api API!' })
})

router.route('/protegido').get((req, res) => {
  res.json({ mensagem: 'OK' })
})

router.use('/usuario', usuario)
router.use('/empresa', empresa)
router.use('/conta', conta)
router.use('/categoria', categoria)
router.use('/formaPagamento', formaPagamento)
router.use('/produto', produto)
router.use('/servico', servico)
router.use('/pacote', pacote)
router.use('/pessoa', pessoa)
router.use('/cliente', cliente)
router.use('/fornecedor', fornecedor)
router.use('/profissional', profissional)
router.use('/agendamento', agendamento)
router.use('/comanda', comanda)

router.route('/publico/cep/:cep').get((req, res) => {
  cep(req.params.cep).then((ret) => {
    res.status(200).json(ret)
  }).catch(err => res.status(404).json(err))
})

/*
const requestify = require('requestify')
const _ = require('lodash')

router.route('/publico/estado/:uf').get((req, res, next) => {
  requestify.get('http://educacao.dadosabertosbr.com/api/cidades/' + req.params.uf.toLowerCase()).then((ret) => {
    let cidades = []
    _.each(ret.getBody(), (cid) => {
      const parts = cid.split(':')
      if(parts.length > 1)
        cidades.push(parts[1])
      else
        cidades.push(cid)
    })
    res.status(200).json(cidades)
  }).catch(err => res.json(err))
})
*/

router.route('/publico/empresa/criar').post((...args) => empresaController.criar(...args))
router.route('/publico/empresa/confirmar').get((...args) => empresaController.confirmar(...args))
router.route('/publico/empresa/confirmar/reenviar').get((...args) => empresaController.reenviarConfirmacao(...args))

module.exports = router
