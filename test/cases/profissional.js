process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Profissional', () => {
  let bearerToken = null
  let profissionalInserido = null
  let profissional = {
        nome: 'CAMILA CIRCE',
        telefone: "(31) 991995552"
      }
  let profissionalUnicidade = {
        nome: 'CAMILA CIRCE',
        telefone: '(31) 252979948'
      }
  let profissionalInvalido = {
        telefone: '(31)'
      }            
  let profissionalAtualizacao = {
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
  describe('Listando profissionais [/GET]', () => {
    let primeiroProfissional = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/profissional').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 8 profissionais', (done) => {
      chai.request(server).get('/profissional').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(8)
        primeiroProfissional = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 5 profissionais paginados ordenado por nome', (done) => {
      chai.request(server).get('/profissional?limit=5&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(5)
        expect(res.body.items[0].nome).eq('DANIELLE MORREALE DINIZ')
        done()
      })
    })   
    it('Deve receber erro 500 por filtro invalido', (done) => {
      chai.request(server).get('/profissional?comissao=aalimit=10&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/profissional?limit=10&skip=0&sort%5Bnome%5D=a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por profissional com id invalido', (done) => {
      chai.request(server).get('/profissional/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 500 quando buscar por profissional com filtro invalido', (done) => {
      chai.request(server).get('/profissional?comissao=aa').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por profissional com id valido porem inexistente', (done) => {
      chai.request(server).get('/profissional/' + primeiroProfissional.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso o primeiro profissional', (done) => {
      chai.request(server).get('/profissional/' + primeiroProfissional._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso o profissional com nome RENATO CAMPOS GALLUPO', (done) => {
      chai.request(server)
        .get('/profissional?nome=RENATO CAMPOS GALLUPO')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].nome).eq('RENATO CAMPOS GALLUPO')
        expect(res.body[0].telefone).eq('(31) 280856849')
        done()
      })
    })
  })
  describe('Inserindo profissionais [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/profissional')
        .send(profissionalInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.nome).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/profissional')
        .send(profissionalUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/profissional')
        .send(profissional)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.nome).eq(profissional.nome)
          profissionalInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando profissionais [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/profissional/' + profissionalInserido._id)
        .send(profissionalUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar profissional com id valido porem inexistente', (done) => {
      chai.request(server).put('/profissional/' + profissionalInserido.empresaId)
        .send(profissional)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/profissional/' + profissionalInserido._id)
        .send(profissionalAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo profissionais [/DELETE]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/profissional')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/profissional/' + profissionalInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/profissional/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/profissional/' + profissionalInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})