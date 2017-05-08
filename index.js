const express    = require('express');
const mongoose   = require('mongoose');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const bluebird   = require('bluebird');
const cors       = require('cors');
const yamlConfig = require('node-yaml-config');
const routes     = require('./routes');
const app  = express();
const jwt = require('jsonwebtoken');

const config     = yamlConfig.load(__dirname + '/config.yml');

mongoose.Promise = bluebird;
mongoose.connect(config.mongo.url);
mongoose.set('debug', true);

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(morgan('tiny', {
  skip: function(req, res) { return process.env.NODE_ENV == 'test'; }
}));
app.use((req, res, next) => {
  if(req.url.substring(1, 8) !== 'publico' && req.url.indexOf('/auth') === -1 && req.url !== '/') {
    var token = req.headers["authorization"];
    if(!token){
      res.status(401).json({ message: 'Token not supplied' });
      return;
    }

    var bearer = token.split(" ");
    if(bearer.length < 2 || (bearer[0] != 'Bearer' && bearer[0] != 'Basic')) {
      res.status(401).json({ message: 'Invalid token format' });
      return;      
    }
    token = bearer[1];  

    if(bearer[0] === 'Bearer') {
      var decoded = jwt.verify(token, config.secret, function(err, decoded){
        if(err){
          res.status(401).json({ message: 'Invalid or expired token' });
          return;
        }
        req.token = token;
        req.usuario = decoded;
        next();
      });
    } else {
      var buf = new Buffer(token, 'base64'); // create a buffer and tell it the 
      var plain_auth = buf.toString();        // read it back out as a string

      var creds = plain_auth.split(':');
      var user = {
        login: creds[0],
        password: creds[1]
      };

      if(user.login == 'frontend-app' && user.password == 'fr0nt&ndAppS7cr3t'){
        if(req.method == 'GET'){
          req.token = token;
          req.usuario = user;
          next();   
        } else {
          res.status(401).json({ message: 'Method not authorized' });
          return;          
        }
      } else if(user.login == 'superuser' && user.password == 'sup&ru53r5&cr3t') {
        req.token = token;
        req.usuario = user;
        next();
      } else {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }
    }

  } else {
    next();
  }
});
app.use('/', routes);
let load = require('./lib/load');
load();

app.set('config', config);
app.set('superSecret', config.secret);

app.use((err, req, res, next) => {
  if(err.errors){
    res.status(400).json(err.errors);
  } else {
    res.status(500).json({ message: err.message });
  }

  console.log(err);
});
config.server.port = process.env.PORT || config.server.port;
app.listen(config.server.port.toString(), () => {
  console.log(`Magic happens on port ${config.server.port}`);
});

module.exports = app;
