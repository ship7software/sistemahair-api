process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Usuario', () => {
  let bearerToken = null
  let usuarioInserido = null
  let usuario = {
        login: 'hermogenes',
        password: 'senha'
      }
  let usuarioUnicidade = {
        login: 'local.superhair@mailinator.com',
        password: 'senha'
      }
  let usuarioInvalido = {
        login: null
      }            
  let usuarioAtualizacao = {
        login: 'hermogenes',
        password: 'senha1'
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
  describe('Listando usuarios [/GET]', () => {
    let primeiroUsuario = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/usuario').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 1 usuario', (done) => {
      chai.request(server).get('/usuario').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        primeiroUsuario = res.body[0]
        done()
      })
    })   
    it('Deve retornar 500 quando buscar por usuario com id invalido', (done) => {
      chai.request(server).get('/usuario/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por usuario com id valido porem inexistente', (done) => {
      chai.request(server).get('/usuario/' + primeiroUsuario.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso o primeiro usuario', (done) => {
      chai.request(server).get('/usuario/' + primeiroUsuario._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso o usuario com login local.superhair@mailinator.com', (done) => {
      chai.request(server)
        .get('/usuario?login=local.superhair@mailinator.com')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].login).eq('local.superhair@mailinator.com')
        done()
      })
    })
  })
  describe('Inserindo usuarios [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/usuario')
        .send(usuarioInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.login).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/usuario')
        .send(usuarioUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/usuario')
        .send(usuario)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.login).eq(usuario.login)
          usuarioInserido = res.body
          done()
      })
    })    
    it('Deve fazer login com o usuario inserido', (done) =>{
      chai.request(server).post('/usuario/auth')
        .send(usuario).end((err, res) => {
          expect(res.status).eq(200)
          done()
      })
    })
  })
  describe('Atualizando usuarios [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/usuario/' + usuarioInserido._id)
        .send(usuarioUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar usuario com id valido porem inexistente', (done) => {
      chai.request(server).put('/usuario/' + usuarioInserido.empresaId)
        .send(usuario)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/usuario/' + usuarioInserido._id)
        .send(usuarioAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo usuarios [/DELETE]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/usuario')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/usuario/' + usuarioInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/usuario/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/usuario/' + usuarioInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})