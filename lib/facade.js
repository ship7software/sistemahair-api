class Facade {
  constructor(Schema) {
    this.Schema = Schema
  }

  create(input) {
    const schema = new this.Schema(input)
    return schema.save()
  }

  update(conditions, update, upsert) {
    return this.Schema
    .update(conditions, update, { new: true, upsert: upsert, multi: true })
    .exec()
  }

  find(query, projection) {
    return this.Schema
    .find(query, projection)
    .exec() 
  }

  count(query) {
    return this.Schema.count(query).exec()
  }

  findWithPagination(query, projection, sort, limit, skip) {
    return this.Schema
    .find(query, projection)
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(limit))
    .exec()    
  }

  findOne(query, populate) {
    let dbQuery = this.Schema.findOne(query)
    if(populate)
      dbQuery = dbQuery.populate(populate)
    return dbQuery.exec()
  }

  findById(id) {
    return this.Schema
    .findById(id)
    .exec()
  }

  remove(id) {
    return this.Schema
    .findByIdAndRemove(id)
    .exec()
  }

  bulkInsert(objs){
    return this.Schema.insertMany(objs)
  }

  bulkRemoveAll(){
    return this.Schema.remove({}).exec()
  }
}

module.exports = Facade
