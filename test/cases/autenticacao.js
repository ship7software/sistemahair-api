let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./../../index');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Controle de acesso', () => {
  describe('/GET /protegido - Teste de Acesso Leitura', () => {
    it('Tento acessar sem token e recebo erro 401', (done) => {
      chai.request(server).get('/protegido').end((err, res) => {
        res.should.have.status(401);
        expect(res.body).to.have.property('message').and.equal('Token not supplied');
        done();
      });
    });
    it('Tento acessar com token em formato inválido', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'asdkasjdk').end((err, res) => {
        res.should.have.status(401);
        expect(res.body).to.have.property('message').and.equal('Invalid token format');
        done();
      });
    });
    it('Tento acessar com super usuario e senha incorreta', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'Basic c3VwZXJ1c2VyOnN1cCZydTUzcjUmY3JldA==').end((err, res) => {
        res.should.have.status(401);
        expect(res.body).to.have.property('message').and.equal('Invalid or expired token');
        done();
      });
    });  
    it('Tento acessar com super usuario e tenho sucesso', (done) => {
      chai.request(server).get('/protegido').set('Authorization', 'Basic c3VwZXJ1c2VyOnN1cCZydTUzcjUmY3IzdA==').end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.property('mensagem').and.equal('OK');
        done();
      });
    });
  });
});

