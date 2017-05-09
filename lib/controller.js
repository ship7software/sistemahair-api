let mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
class Controller {
  constructor(facade) {
    this.facade = facade
  }

  find(req, res, next) {
    if(this.facade.Schema.collection.collectionName != 'empresas')
      req.query.empresaId = new ObjectId(req.usuario.empresaId)
    let query = req.query
    const sort = query.sort
    const limit = query.limit
    const skip = query.skip
    delete query['sort']
    delete query['limit']
    delete query['skip'] 

    if(skip && limit) {
      this.facade.count(query).then(count => {
        return this.facade.findWithPagination(req.query, null, JSON.parse(sort), limit, skip)
        .then(collection => {
          res.status(200).json({ items: collection, total: count }) 
        }).catch(err => { next(err) })
      }).catch(err => { next(err) })
    }
    else {
      return this.facade.find(req.query)
      .then(collection => res.status(200).json(collection))
      .catch(err => { next(err) })
    }
  }

  findById(req, res, next) {
    return this.facade.findById(req.params.id)
    .then(doc => {
      if (!doc) { return res.status(404).end() }
      return res.status(200).json(doc)
    })
    .catch(err => { next(err) })
  }

  create(req, res, next) {
    if(this.facade.Schema.collection.collectionName != 'empresas')
      req.body.empresaId = new ObjectId(req.usuario.empresaId)
    this.facade.create(req.body).then(doc => res.status(201).json(doc))
    .catch(err => { next(err) })
  }

  update(req, res, next) {
    const conditions = { _id: req.params.id }

    this.facade.update(conditions, req.body)
    .then(doc => {
      if (!doc || doc.nModified == 0) { return res.status(404).json(doc) }
      return res.status(200).json(doc)
    })
    .catch(err => { next(err) })
  }

  remove(req, res, next) {
    this.facade.remove(req.params.id)
    .then(doc => {
      if (!doc) { return res.status(404).end() }
      return res.status(204).end()
    })
    .catch(err => { next(err) })
  }

}

module.exports = Controller
