process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('cliente', () => {
  let bearerToken = null
  let clienteInserido = null
  let cliente = {
        nome: 'CAMILA CIRCE',
        telefone: "(31) 991995552"
      }
  let clienteUnicidade = {
        nome: 'CAMILA CIRCE',
        telefone: '(31) 296457991'
      }
  let clienteInvalido = {
        telefone: '(31)'
      }            
  let clienteAtualizacao = {
        nome: 'CAMILA CIRCE FERREIRA',
        telefone: "(31) 991995552"
      }
  before('Dado que eu estou logado com um usuário válido', (done) => {
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
  describe('Listando clientes [/GET]', () => {
    let primeiroCliente = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/cliente').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 175 clientes', (done) => {
      chai.request(server).get('/cliente').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(175)
        primeiroCliente = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 5 clientes paginados ordenado por nome', (done) => {
      chai.request(server).get('/cliente?limit=5&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(5)
        expect(res.body.items[0].nome).eq('AIDE FERREIRA FERRAZ')
        done()
      })
    })    
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/cliente?limit=10&skip=0&sort%5Bnome%5D=a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por cliente com id invalido', (done) => {
      chai.request(server).get('/cliente/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por cliente com id valido porem inexistente', (done) => {
      chai.request(server).get('/cliente/' + primeiroCliente.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso o primeiro cliente', (done) => {
      chai.request(server).get('/cliente/' + primeiroCliente._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso o cliente com nome DÉBORA CHAMON', (done) => {
      chai.request(server)
        .get('/cliente?nome=DÉBORA CHAMON')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].nome).eq('DÉBORA CHAMON')
        expect(res.body[0].telefone).eq('(31) 208341964')
        done()
      })
    })
  })
  describe('Inserindo clientes [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/cliente')
        .send(clienteInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.nome).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/cliente')
        .send(clienteUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/cliente')
        .send(cliente)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.nome).eq(cliente.nome)
          clienteInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando clientes [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/cliente/' + clienteInserido._id)
        .send(clienteUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar cliente com id valido porem inexistente', (done) => {
      chai.request(server).put('/cliente/' + clienteInserido.empresaId)
        .send(cliente)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/cliente/' + clienteInserido._id)
        .send(clienteAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo clientes [/DELETE]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/cliente')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/cliente/' + clienteInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/cliente/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/cliente/' + clienteInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})