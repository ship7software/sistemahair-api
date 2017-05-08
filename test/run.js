process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./../index');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Inicio', () => {
  describe('/GET Mensagem Bem vindo', () => {
    it('Recebo a mensagem de bem vindo do servidor', (done) => {
      chai.request(server).get('/').end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message').and.equal('Welcome to sistemahair-api API!');
        done();
      });
    });
  });
});

require('./cases/autenticacao');

