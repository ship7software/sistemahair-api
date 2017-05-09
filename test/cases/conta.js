process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Conta', () => {
  let bearerToken = null
  let contaInserido = null
  let conta = {
        nome: 'PAGSEGURO'
      }
  let contaUnicidade = {
        nome: 'BANCO'
      }
  let contaInvalido = {}            
  let contaAtualizacao = {
        nome: 'PAGSEGURO - UOL'
      }
  beforeEach('Dado que eu estou logado com um usuário válido', (done) => {
      chai.request(server).post('/usuario/auth').send({
        login: 'local.superhair@mailinator.com',
        password: '123456@'
      }).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).to.have.property('token')
        bearerToken = 'Bearer ' + res.body.token
        done()
      })
  })
  describe('Listando contas [/GET]', () => {
    let primeiraConta = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/conta').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 2 contas', (done) => {
      chai.request(server).get('/conta').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(2)
        primeiraConta = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 1 conta paginada ordenado por nome', (done) => {
      chai.request(server).get('/conta?limit=1&skip=0&sort=%7B%22nome%22%3A1%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(1)
        expect(res.body.items[0].nome).eq('BANCO')
        done()
      })
    })    
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/conta?limit=10&skip=0&sort=%7B%22nome%22%3A%22a%22%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por conta com id invalido', (done) => {
      chai.request(server).get('/conta/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por conta com id valido porem inexistente', (done) => {
      chai.request(server).get('/conta/' + primeiraConta.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso a primeira conta', (done) => {
      chai.request(server).get('/conta/' + primeiraConta._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso a conta com nome CAIXA', (done) => {
      chai.request(server)
        .get('/conta?nome=CAIXA')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].nome).eq('CAIXA')
        done()
      })
    })
  })
  describe('Inserindo contas [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/conta')
        .send(contaInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.nome).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/conta')
        .send(contaUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/conta')
        .send(conta)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.nome).eq(conta.nome)
          contaInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando contas [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/conta/' + contaInserido._id)
        .send(contaUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar conta com id valido porem inexistente', (done) => {
      chai.request(server).put('/conta/' + contaInserido.empresaId)
        .send(conta)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/conta/' + contaInserido._id)
        .send(contaAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo contas [/PUT]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/conta')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/conta/' + contaInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/conta/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/conta/' + contaInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})