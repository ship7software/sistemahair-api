process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Serviço', () => {
  let bearerToken = null
  let servicoInserido = null
  let servico = {
        descricao: 'MECHAS',
        preco: 109.9,
        duracaoPadrao: 75,
        comissao: 10
      }
  let servicoUnicidade = {
        descricao: 'ESCOVA',
        preco: 109.9,
        duracaoPadrao: 75,
        comissao: 10
      }
  let servicoInvalido = {
        descricao: null,
        preco: 109.9,
        duracaoPadrao: 75,
        comissao: 10
      }            
  let servicoAtualizacao = {
        descricao: 'MECHAS',
        preco: 109.9,
        duracaoPadrao: 75,
        comissao: 5
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
  describe('Listando servicos [/GET]', () => {
    let primeiroServico = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/servico').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 7 servicos', (done) => {
      chai.request(server).get('/servico').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(7)
        primeiroServico = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 5 servicos paginados ordenado por descricao', (done) => {
      chai.request(server).get('/servico?limit=5&skip=0&sort=%7B%22descricao%22%3A1%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(5)
        expect(res.body.items[0].descricao).eq('CORTE FEMININO')
        done()
      })
    })   
    it('Deve receber erro 500 por filtro invalido', (done) => {
      chai.request(server).get('/servico?preco=aalimit=10&skip=0&sort=%7B%22descricao%22%3A1%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/servico?limit=10&skip=0&sort=%7B%22descricao%22%3A%22a%22%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por servico com id invalido', (done) => {
      chai.request(server).get('/servico/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 500 quando buscar por servico com filtro invalido', (done) => {
      chai.request(server).get('/servico?preco=aa').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por servico com id valido porem inexistente', (done) => {
      chai.request(server).get('/servico/' + primeiroServico.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso o primeiro servico', (done) => {
      chai.request(server).get('/servico/' + primeiroServico._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso o servico com nome CORTE MASCULINO', (done) => {
      chai.request(server)
        .get('/servico?descricao=CORTE MASCULINO')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].descricao).eq('CORTE MASCULINO')
        expect(res.body[0].comissao).eq(0)
        expect(res.body[0].preco).eq(30)
        expect(res.body[0].duracaoPadrao).eq(15)
        done()
      })
    })
  })
  describe('Inserindo servicos [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/servico')
        .send(servicoInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.descricao).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/servico')
        .send(servicoUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/servico')
        .send(servico)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.descricao).eq(servico.descricao)
          servicoInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando servicos [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/servico/' + servicoInserido._id)
        .send(servicoUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar servico com id valido porem inexistente', (done) => {
      chai.request(server).put('/servico/' + servicoInserido.empresaId)
        .send(servico)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/servico/' + servicoInserido._id)
        .send(servicoAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo servicos [/PUT]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/servico')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/servico/' + servicoInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/servico/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/servico/' + servicoInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})