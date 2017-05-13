process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Pessoa', () => {
  let bearerToken = null
  let primeiraPessoa = null
  let pessoa = {
        nome: 'CAMILA CIRCE',
        telefone: "(31) 991995552"
      }
  let pessoaUnicidade = {
        nome: 'CAMILA CIRCE',
        telefone: '(31) 296457991'
      }
  let pessoaInvalido = {
        telefone: '(31)'
      }            
  let pessoaAtualizacao = {
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
  describe('Listando pessoas [/GET]', () => {
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/pessoa').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 249 pessoas', (done) => {
      chai.request(server).get('/pessoa').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(249)
        primeiraPessoa = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 5 pessoas paginados ordenado por nome', (done) => {
      chai.request(server).get('/pessoa?limit=5&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(5)
        expect(res.body.items[0].nome).eq('ACILIO OLIVEIRA DE LARA RESENDE')
        done()
      })
    })    
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/pessoa?limit=10&skip=0&sort%5Bnome%5D=a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por pessoa com id invalido', (done) => {
      chai.request(server).get('/pessoa/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por pessoa com id valido porem inexistente', (done) => {
      chai.request(server).get('/pessoa/' + primeiraPessoa.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso a primeira pessoa', (done) => {
      chai.request(server).get('/pessoa/' + primeiraPessoa._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso a pessoa com nome DÉBORA CHAMON', (done) => {
      chai.request(server)
        .get('/pessoa?nome=DÉBORA CHAMON')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].nome).eq('DÉBORA CHAMON')
        expect(res.body[0].telefone).eq('(31) 208341964')
        done()
      })
    })
  })
  describe('Inserindo pessoas [/POST]', () => {
    it('Deve receber erro 404 porque a inserção deve ser feita no tipo específico', (done) =>{
      chai.request(server).post('/pessoa')
        .send(pessoa)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
  })
  describe('Atualizando pessoas [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/pessoa/' + primeiraPessoa._id)
        .send(pessoaUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar pessoa com id valido porem inexistente', (done) => {
      chai.request(server).put('/pessoa/' + primeiraPessoa.empresaId)
        .send(pessoa)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/pessoa/' + primeiraPessoa._id)
        .send(pessoaAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo pessoas [/DELETE]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/pessoa')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/pessoa/' + primeiraPessoa.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/pessoa/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/pessoa/' + primeiraPessoa._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})