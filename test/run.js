process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../index')
let expect = chai.expect
let populate = require('./populate.js')

chai.use(chaiHttp)

describe('Inicio', () => {
  it('Carregar os dados de teste', (done) => {
    populate((err) => {
      expect(err).eq(undefined)
      done()
    })
  })
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
require('./cases/produto')

