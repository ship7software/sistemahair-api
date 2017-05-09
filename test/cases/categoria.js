process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Categoria', () => {
  let bearerToken = null
  let categoriaInserido = null
  let categoria = {
        descricao: 'INTERNET',
        tipo: 'D'
      }
  let categoriaUnicidade = {
        descricao: 'ALUGUEL',
        tipo: 'D'
      }
  let categoriaInvalido = {
        tipo: 'D'
      }            
  let categoriaAtualizacao = {
        descricao: 'NET',
        tipo: 'D'
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
  describe('Listando categorias [/GET]', () => {
    let primeiraCategoria = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/categoria').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 8 categorias', (done) => {
      chai.request(server).get('/categoria').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(8)
        primeiraCategoria = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 5 categorias paginados ordenado por descricao', (done) => {
      chai.request(server).get('/categoria?limit=5&skip=0&sort=%7B%22descricao%22%3A1%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(5)
        expect(res.body.items[0].descricao).eq('ALUGUEL')
        done()
      })
    })    
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/categoria?limit=10&skip=0&sort=%7B%22descricao%22%3A%22a%22%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por categoria com id invalido', (done) => {
      chai.request(server).get('/categoria/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por categoria com id valido porem inexistente', (done) => {
      chai.request(server).get('/categoria/' + primeiraCategoria.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso a primeira categoria', (done) => {
      chai.request(server).get('/categoria/' + primeiraCategoria._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso a categoria com descricao PACOTES', (done) => {
      chai.request(server)
        .get('/categoria?descricao=PACOTES')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].descricao).eq('PACOTES')
        expect(res.body[0].tipo).eq('C')
        done()
      })
    })
  })
  describe('Inserindo categorias [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/categoria')
        .send(categoriaInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.descricao).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/categoria')
        .send(categoriaUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/categoria')
        .send(categoria)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.descricao).eq(categoria.descricao)
          categoriaInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando categorias [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/categoria/' + categoriaInserido._id)
        .send(categoriaUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar categoria com id valido porem inexistente', (done) => {
      chai.request(server).put('/categoria/' + categoriaInserido.empresaId)
        .send(categoria)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/categoria/' + categoriaInserido._id)
        .send(categoriaAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo categorias [/PUT]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/categoria')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/categoria/' + categoriaInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/categoria/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/categoria/' + categoriaInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})