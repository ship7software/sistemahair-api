process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Fornecedor', () => {
  let bearerToken = null
  let fornecedorInserido = null
  let fornecedor = {
        nome: 'CAMILA CIRCE',
        telefone: "(31) 991995552"
      }
  let fornecedorUnicidade = {
        nome: 'CAMILA CIRCE',
        telefone: '(31) 272614347'
      }
  let fornecedorInvalido = {
        telefone: '(31)'
      }            
  let fornecedorAtualizacao = {
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
  describe('Listando fornecedores [/GET]', () => {
    let primeiroFornecedor = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/fornecedor').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 66 fornecedores', (done) => {
      chai.request(server).get('/fornecedor').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(66)
        primeiroFornecedor = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 5 fornecedores paginados ordenado por nome', (done) => {
      chai.request(server).get('/fornecedor?limit=5&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(5)
        expect(res.body.items[0].nome).eq('ACILIO OLIVEIRA DE LARA RESENDE')
        done()
      })
    })    
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/fornecedor?limit=10&skip=0&sort%5Bnome%5D=a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por fornecedor com id invalido', (done) => {
      chai.request(server).get('/fornecedor/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por fornecedor com id valido porem inexistente', (done) => {
      chai.request(server).get('/fornecedor/' + primeiroFornecedor.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso o primeiro fornecedor', (done) => {
      chai.request(server).get('/fornecedor/' + primeiroFornecedor._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso o fornecedor com nome ADER ALVES DE ASSIS', (done) => {
      chai.request(server)
        .get('/fornecedor?nome=ADER ALVES DE ASSIS')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].nome).eq('ADER ALVES DE ASSIS')
        expect(res.body[0].telefone).eq('(31) 295381966')
        done()
      })
    })
  })
  describe('Inserindo fornecedores [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/fornecedor')
        .send(fornecedorInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.nome).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/fornecedor')
        .send(fornecedorUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/fornecedor')
        .send(fornecedor)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.nome).eq(fornecedor.nome)
          fornecedorInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando fornecedores [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/fornecedor/' + fornecedorInserido._id)
        .send(fornecedorUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar fornecedor com id valido porem inexistente', (done) => {
      chai.request(server).put('/fornecedor/' + fornecedorInserido.empresaId)
        .send(fornecedor)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/fornecedor/' + fornecedorInserido._id)
        .send(fornecedorAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo fornecedores [/DELETE]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/fornecedor')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/fornecedor/' + fornecedorInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/fornecedor/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/fornecedor/' + fornecedorInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})