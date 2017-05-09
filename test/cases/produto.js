let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Produto', () => {
  let bearerToken = null
  let produtoInserido = null
  let produto = {
        descricao: 'SEDA - SHAMPOO - 500ML',
        preco: 109.9,
        custo: 87.92,
        estoque: 10
      }
  let produtoUnicidade = {
        descricao: 'LOLA - SHAMPOO VOLUMÃO - 230ML',
        preco: 109.9,
        custo: 87.92,
        estoque: 10
      }
  let produtoInvalido = {
        descricao: null,
        preco: 109.9,
        custo: 87.92,
        estoque: 10
      }            
  let produtoAtualizacao = {
        descricao: 'SEDA - SHAMPOO - 500ML (NOVO)',
        preco: 109.9,
        custo: 87.92,
        estoque: 10
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
  describe('Listando produtos [/GET]', () => {
    let primeiroProduto = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/produto').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 66 produtos', (done) => {
      chai.request(server).get('/produto').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(66)
        primeiroProduto = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 10 produtos paginados ordenado por descricao', (done) => {
      chai.request(server).get('/produto?limit=10&skip=0&sort=%7B%22descricao%22%3A1%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(10)
        expect(res.body.items[0].descricao).eq('AGI MAX - NUTRIMAX SHAMPOO 500ML')
        done()
      })
    })   
    it('Deve receber erro 500 por filtro invalido', (done) => {
      chai.request(server).get('/produto?preco=aalimit=10&skip=0&sort=%7B%22descricao%22%3A1%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/produto?limit=10&skip=0&sort=%7B%22descricao%22%3A%22a%22%7D').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        console.log(res.body)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por produto com id invalido', (done) => {
      chai.request(server).get('/produto/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 500 quando buscar por produto com filtro invalido', (done) => {
      chai.request(server).get('/produto?preco=aa').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por produto com id valido porem inexistente', (done) => {
      chai.request(server).get('/produto/' + primeiroProduto.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso o primeiro produto', (done) => {
      chai.request(server).get('/produto/' + primeiroProduto._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso o produto com nome INOAR - ARGAN SYSTEM SHAMPOO DE TRATAMENTO - 1000ML', (done) => {
      chai.request(server)
        .get('/produto?descricao=INOAR - ARGAN SYSTEM SHAMPOO DE TRATAMENTO - 1000ML')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].descricao).eq('INOAR - ARGAN SYSTEM SHAMPOO DE TRATAMENTO - 1000ML')
        expect(res.body[0].estoque).eq(10)
        expect(res.body[0].preco).eq(33.9)
        expect(res.body[0].custo).eq(27.12)
        done()
      })
    })
  })
  describe('Inserindo produtos [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/produto')
        .send(produtoInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.descricao).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/produto')
        .send(produtoUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/produto')
        .send(produto)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.descricao).eq(produto.descricao)
          produtoInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando produtos [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/produto/' + produtoInserido._id)
        .send(produtoUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar produto com id valido porem inexistente', (done) => {
      chai.request(server).put('/produto/' + produtoInserido.empresaId)
        .send(produto)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/produto/' + produtoInserido._id)
        .send(produtoAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo produtos [/PUT]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/produto')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/produto/' + produtoInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/produto/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/produto/' + produtoInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})