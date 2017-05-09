process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Pacote', () => {
  let bearerToken = null
  let pacoteInserido = null
  let pacote = {
        descricao: 'PROMOCAO 1',
        produtos: [],
        servicos: []
      }
  let pacoteInvalido = {
        descricao: null
      }            
  let pacoteAtualizacao = {
        descricao: 'PROMOCAO FINAL'
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
  describe('Buscando produtos e serviços para inserir o pacote', () => {
    it('[/GET] - Deve receber com sucesso uma lista de produtos', (done) => {
      chai.request(server).get('/produto').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length.greaterThan(0)
        pacote.produtos.push({
          produtoId: res.body[0]._id,
          quantidade: 1
        })
        done()
      })
    })
    it('[/GET] - Deve receber com sucesso uma lista de serviços', (done) => {
      chai.request(server).get('/servico').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length.greaterThan(0)
        pacote.servicos.push({
          servicoId: res.body[0]._id,
          quantidade: 1
        })
        done()
      })
    })    
  })  
  describe('Listando e criando pacotes', () => {
    it('[/GET] - Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/pacote').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('[/GET] - Deve receber com sucesso uma lista vazia de pacote', (done) => {
      chai.request(server).get('/pacote').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(0)
        done()
      })
    })   
    it('[/POST] - Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/pacote')
        .send(pacoteInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.descricao).not.eq(undefined)
          done()
      })
    })    
    it('[/POST] - Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/pacote')
        .send(pacote)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.descricao).eq(pacote.descricao)
          pacoteInserido = res.body
          done()
      })
    }) 
    it('[/POST] - Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/pacote')
        .send(pacote)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    }) 
    it('[/GET] - Deve receber com sucesso uma lista com 1 pacote', (done) => {
      chai.request(server).get('/pacote').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        done()
      })
    })         
    it('[/GET] - Deve retornar 500 quando buscar por pacote com id invalido', (done) => {
      chai.request(server).get('/pacote/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('[/GET] - Deve retornar 404 quando buscar por pacote com id valido porem inexistente', (done) => {
      chai.request(server).get('/pacote/' + pacoteInserido.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('[/GET] - Deve retornar com sucesso o primeiro pacote', (done) => {
      chai.request(server).get('/pacote/' + pacoteInserido._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('[/GET] - Deve retornar com sucesso o pacote com descricao PROMOCAO 1', (done) => {
      chai.request(server)
        .get('/pacote?descricao=PROMOCAO 1')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].descricao).eq('PROMOCAO 1')
        done()
      })
    })
  })
  describe('Atualizando pacotes [/PUT]', () => {
    it('Deve retornar 404 quando atualizar pacote com id valido porem inexistente', (done) => {
      chai.request(server).put('/pacote/' + pacoteInserido.empresaId)
        .send(pacote)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/pacote/' + pacoteInserido._id)
        .send(pacoteAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo pacotes [/DELETE]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/pacote')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/pacote/' + pacoteInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/pacote/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/pacote/' + pacoteInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})