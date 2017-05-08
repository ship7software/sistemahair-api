let db = { models: [] };

const fs = require('fs');
const arquivos = fs.readdirSync(__dirname, '.json');

for (let idx = 0; idx < arquivos.length; idx++) {
  const element = arquivos[idx];
  if(element.indexOf('.json') > -1){
    let modelName = element.replace('.json', '');
    let model = JSON.parse(fs.readFileSync(__dirname + '/' + element, 'utf8'));

    db[modelName] = model;
    db.models.push(modelName);
  }
}

module.exports = db;