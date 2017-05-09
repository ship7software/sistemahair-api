let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Controle de acesso', () => {
  describe('/GET /protegido - Teste de Acesso', () => {
    var bearerToken = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/protegido').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Devo receber erro 401 ao acessar usando token com formato inválido', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'asdkasjdk').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Invalid token format')
        done()
      })
    })
    it('Devo receber erro 401 ao acessar com super usuario e senha incorreta', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'Basic c3VwZXJ1c2VyOnN1cCZydTUzcjUmY3JldA==').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Invalid or expired token')
        done()
      })
    })  
    it('Devo receber status 200 ao acessar com super usuario e senha correta', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'Basic c3VwZXJ1c2VyOnN1cCZydTUzcjUmY3IzdA==').end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).to.have.property('mensagem').and.equal('OK')
        done()
      })
    })
    it('Devo receber erro 401 acessar com usuario nao autenticado', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'Bearer c3VwZXJ1c2VyOnN1cCZydTUzcjUmY3JldA==').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Invalid or expired token')
        done()
      })
    })
    it('Devo receber erro 401 ao tentar autenticar com usuário inválido', (done) => {
      chai.request(server).post('/usuario/auth').send({
        login: 'usuarioinvalido',
        password: 'teste'
      }).end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('errorCode').and.equal('INVALID_USER')
        done()
      })
    })
    it('Devo receber erro 401 ao tentar autenticar com senha inválida', (done) => {
      chai.request(server).post('/usuario/auth').send({
        login: 'local.superhair@mailinator.com',
        password: 'teste'
      }).end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('errorCode').and.equal('INVALID_PASSWORD')
        done()
      })
    })
    it('Devo receber status 200 ao autenticar com usuário e senhas válidos', (done) => {
      chai.request(server).post('/usuario/auth').send({
        login: 'local.superhair@mailinator.com',
        password: '123456@'
      }).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).to.have.property('token')
        bearerToken = res.body.token
        done()
      })
    })
    it('Devo receber status 200 ao acessar com o token do usuario', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'Bearer ' + bearerToken).send({
        login: 'local.superhair@mailinator.com',
        password: '123456@'
      }).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).to.have.property('mensagem').and.equal('OK')
        done()
      })
    })

  })
})

