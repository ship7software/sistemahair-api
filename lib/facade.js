class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  create(input) {
    const schema = new this.Schema(input);
    return schema.save();
  }

  update(conditions, update) {
    return this.Schema
    .update(conditions, update, { new: true })
    .exec();
  }

  find(query, projection) {
    return this.Schema
    .find(query, projection)
    .exec(); 
  }

  count(query) {
    return this.Schema.count(query).exec();
  }

  findWithPagination(query, projection, sort, limit, skip) {
    return this.Schema
    .find(query, projection)
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(limit))
    .exec();    
  }

  findOne(query) {
    return this.Schema
    .findOne(query)
    .exec();
  }

  findById(id) {
    return this.Schema
    .findById(id)
    .exec();
  }

  remove(id) {
    return this.Schema
    .findByIdAndRemove(id)
    .exec();
  }

  findByIdAndUpdate(id, update, options) {
    return this.Schema
    .findByIdAndUpdate(id, update, options)
    .exec();
  }

  findOneAndUpdate(query, update, options) {
    return this.Schema
    .findOneAndUpdate(query, update, options)
    .exec();
  }

  bulkInsert(objs){
    return this.Schema.insertMany(objs);
  }

  bulkRemoveAll(){
    return this.Schema.remove({}).exec();
  }
}

module.exports = Facade;
