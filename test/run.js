process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Inicio', () => {
  describe('/GET Mensagem Bem vindo', () => {
    it('Recebo a mensagem de bem vindo do servidor', (done) => {
      chai.request(server).get('/').end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).be.a('object')
        expect(res.body).to.have.property('message').and.equal('Welcome to sistemahair-api API!')
        done()
      })
    })
  })
})

require('./cases/autenticacao')
require('./cases/empresa')
require('./cases/produto')
require('./cases/servico')
require('./cases/conta')
require('./cases/formaPagamento')
require('./cases/categoria')
require('./cases/profissional')
require('./cases/fornecedor')
require('./cases/cliente')
require('./cases/pessoa')
require('./cases/usuario')
require('./cases/pacote')
