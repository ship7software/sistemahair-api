process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('CEP', () => {
  describe('Buscar CEP [/GET]', () => {
    let primeiroUsuario = null
    it('Deve receber erro 404 ao buscar cep invalido', (done) => {
      chai.request(server).get('/publico/cep/5').end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve receber sucesso ao buscar cep valido', (done) => {
      chai.request(server).get('/publico/cep/31340290').end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.localidade).equals('Belo Horizonte')
        done()
      })
    })    
  })
})