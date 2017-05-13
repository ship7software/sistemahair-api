process.env.NODE_ENV = 'test'
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('FormaPagamento', () => {
  let bearerToken = null
  let formaPagamentoInserido = null
  let formaPagamento = {
        nome: 'VALE',
        taxa: 0,
        prazoRecebimento: 0,
        tipoBaixa: 'M'
      }
  let formaPagamentoUnicidade = {
        nome: 'DINHEIRO',
        taxa: 0,
        prazoRecebimento: 0,
        tipoBaixa: 'A'
      }
  let formaPagamentoInvalido = {
        taxa: 0,
        prazoRecebimento: 0,
        tipoBaixa: 'A'
      }            
  let formaPagamentoAtualizacao = {
        nome: 'VALE FUNCIONARIO',
        taxa: 0,
        prazoRecebimento: 0,
        tipoBaixa: 'M'
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
  describe('Listando formas de pagamento [/GET]', () => {
    let primeiraFormaPagamento = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/formaPagamento').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 8 formas de pagamento', (done) => {
      chai.request(server).get('/formaPagamento').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(8)
        primeiraFormaPagamento = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 5 formas de pagamento paginados ordenado por nome', (done) => {
      chai.request(server).get('/formaPagamento?limit=5&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(5)
        expect(res.body.items[0].nome).eq('BOLETO')
        done()
      })
    })   
    it('Deve receber erro 500 por filtro invalido', (done) => {
      chai.request(server).get('/formaPagamento?taxa=aalimit=10&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/formaPagamento?limit=10&skip=0&sort%5Bnome%5D=a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por formaPagamento com id invalido', (done) => {
      chai.request(server).get('/formaPagamento/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 500 quando buscar por formaPagamento com filtro invalido', (done) => {
      chai.request(server).get('/formaPagamento?taxa=aa').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por formaPagamento com id valido porem inexistente', (done) => {
      chai.request(server).get('/formaPagamento/' + primeiraFormaPagamento.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso o primeiro formaPagamento', (done) => {
      chai.request(server).get('/formaPagamento/' + primeiraFormaPagamento._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso o formaPagamento com nome CHEQUE PRÉ', (done) => {
      chai.request(server)
        .get('/formaPagamento?nome=CHEQUE PRÉ')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].nome).eq('CHEQUE PRÉ')
        expect(res.body[0].taxa).eq(0)
        expect(res.body[0].prazoRecebimento).eq(0)
        expect(res.body[0].tipoBaixa).eq('M')
        done()
      })
    })
  })
  describe('Inserindo formas de pagamento [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/formaPagamento')
        .send(formaPagamentoInvalido)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.nome).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/formaPagamento')
        .send(formaPagamentoUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/formaPagamento')
        .send(formaPagamento)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.nome).eq(formaPagamento.nome)
          formaPagamentoInserido = res.body
          done()
      })
    })
  })
  describe('Atualizando formas de pagamento [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/formaPagamento/' + formaPagamentoInserido._id)
        .send(formaPagamentoUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar formaPagamento com id valido porem inexistente', (done) => {
      chai.request(server).put('/formaPagamento/' + formaPagamentoInserido.empresaId)
        .send(formaPagamento)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/formaPagamento/' + formaPagamentoInserido._id)
        .send(formaPagamentoAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
  })
  describe('Excluindo formas de pagamento [/PUT]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/formaPagamento')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/formaPagamento/' + formaPagamentoInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/formaPagamento/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/formaPagamento/' + formaPagamentoInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})