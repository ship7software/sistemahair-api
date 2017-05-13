let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Empresa', () => {
  let bearerToken = null
  let usuarioInserido = null
  let empresa1 = {
    "subdominio": "empresa1",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "telefone": "(31) 9999-9991",
    "nome": "Empresa 1",
    "email": "empresa1.hair@mailinator.com",
    "password": "1234567@",
    "nomeResponsavel": "Hermógenes Ferreira"
  }
  let empresaUnicidade = {
    "subdominio": "empresa1",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "telefone": "(31) 9999-9991",
    "nome": "Empresa 1",
    "email": "local.superhair@mailinator.com",
    "password": "1234567@",
    "nomeResponsavel": "Hermógenes Ferreira"
  }
  let empresaAtualizacao = {
    "subdominio": "empresa1",
    "cidade": "Montes Claros",
    "estado": "MG",
    "telefone": "(31) 9999-9991",
    "nome": "Empresa 1",
    "email": "empresa2.hair@mailinator.com",
    "nomeResponsavel": "Hermógenes Ferreira"
  }  
  let empresaFaltaDados = {
    "subdominio": "empresa1",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "telefone": "(31) 9999-9991"
  }
  let empresaFaltaSenha = {
    "subdominio": "empresaFaltaSenha",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "telefone": "(31) 9999-9990",
    "nome": "Empresa empresaFaltaSenha",
    "email": "empresaFaltaSenha.hair@mailinator.com",
    "nomeResponsavel": "Hermógenes Ferreira"
  }  

  describe('Criando empresas [/POST]', () => {
    it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
      chai.request(server).post('/publico/empresa/criar')
        .send(empresaFaltaDados).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.email).not.eq(undefined)
          done()
      })
    })
    it('Deve receber erro 400 por falta de senha', (done) =>{
      chai.request(server).post('/publico/empresa/criar')
        .send(empresaFaltaSenha).end((err, res) => {
          expect(res.status).eq(400)
          expect(res.body.password).not.eq(undefined)
          done()
      })
    })    
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/publico/empresa/criar')
        .send(empresa1).end((err, res) => {
          expect(res.status).eq(201)
          expect(res.body.login).eq(empresa1.email)
          usuarioInserido = res.body
          done()
      })
    })
    it('Deve existir uma empresa com o email inserido', (done) =>{
      chai.request(server).get('/empresa?email=' + usuarioInserido.login).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })    
    it('Deve existir um usuário com o email inserido', (done) =>{
      chai.request(server).get('/usuario?email=' + usuarioInserido.login).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })     
    it('Deve receber erro 400 por quebra de unicidade', (done) =>{
      chai.request(server).post('/publico/empresa/criar')
        .send(empresa1).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
  })  
  it('Dado que eu estou logado com um usuário válido', (done) => {
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
  describe('Listando empresas [/GET]', () => {
    let primeiraEmpresa = null
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/empresa').end((err, res) => {
        expect(res.status).eq(401)
        expect(res.body).to.have.property('message').and.equal('Token not supplied')
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 2 empresas', (done) => {
      chai.request(server).get('/empresa').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(2)
        primeiraEmpresa = res.body[0]
        done()
      })
    })
    it('Deve receber com sucesso uma lista de 1 empresa paginados ordenado por nome', (done) => {
      chai.request(server).get('/empresa?limit=1&skip=0&sort%5Bnome%5D=1').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.items).a('array').and.length(1)
        expect(res.body.items[0].nome).eq('Empresa 1')
        done()
      })
    })     
    it('Deve receber erro 500 por paginacao incorreta', (done) => {
      chai.request(server).get('/empresa?limit=10&skip=0&sort%5Bnome%5D=a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })     
    it('Deve retornar 500 quando buscar por empresa com id invalido', (done) => {
      chai.request(server).get('/empresa/a').set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(500)
        done()
      })
    })
    it('Deve retornar 404 quando buscar por empresa com id valido porem inexistente', (done) => {
      chai.request(server).get('/empresa/' + usuarioInserido._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(404)
        done()
      })
    })
    it('Deve retornar com sucesso a primeira empresa', (done) => {
      chai.request(server).get('/empresa/' + primeiraEmpresa._id).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        done()
      })
    })
    it('Deve retornar com sucesso a empresa com nome Empresa 1', (done) => {
      chai.request(server)
        .get('/empresa?nome=Empresa 1')
        .set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).a('array').and.length(1)
        expect(res.body[0].nome).eq('Empresa 1')
        done()
      })
    })
  })
  describe('Atualizando empresas [/PUT]', () => {
    it('Deve receber erro 400 por quebra de unicidade', (done) => {
      chai.request(server).put('/empresa/' + usuarioInserido.empresaId)
        .send(empresaUnicidade)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(400)
          done()
      })
    })    
    it('Deve retornar 404 quando atualizar empresa com id valido porem inexistente', (done) => {
      chai.request(server).put('/empresa/' + usuarioInserido._id)
        .send(empresa1)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    }) 
    it('Deve ser atualizado com sucesso', (done) => {
      chai.request(server).put('/empresa/' + usuarioInserido.empresaId)
        .send(empresaAtualizacao)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(200)
          expect(res.body.nModified).eq(1)
          done()
      })
    })
    it('Deve retornar com sucesso a empresa com os dados atualizados', (done) => {
      chai.request(server).get('/empresa/' + usuarioInserido.empresaId).set('Authorization', bearerToken).end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body.nome).eq(empresaAtualizacao.nome)
        done()
      })
    })    
  })
  describe('Excluindo empresas [/DELETE]', () => {
    it('Deve receber erro 404 por nao informar o ID', (done) => {
      chai.request(server).delete('/empresa')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 404 por informar ID valido porem inexistente', (done) => {
      chai.request(server).delete('/empresa/' + usuarioInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(404)
          done()
      })
    })
    it('Deve receber erro 500 por informar ID invalido', (done) => {
      chai.request(server).delete('/empresa/a')
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(500)
          done()
      })
    })         
    it('Deve ser removido com sucesso', (done) => {
      chai.request(server).delete('/empresa/' + usuarioInserido.empresaId)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })         
    it('Remover usuario relacionado', (done) => {
      chai.request(server).delete('/usuario/' + usuarioInserido._id)
        .set('Authorization', bearerToken).end((err, res) => {
          expect(res.status).eq(204)
          done()
      })
    })
  })
})