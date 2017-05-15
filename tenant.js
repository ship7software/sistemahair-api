let substitute = {}
substitute['127.0.0.1'] = 'localhost'

module.exports = (req, res, next) => {
  let tenant = req.hostname

  if(req.headers && req.headers['x-brand']){
    tenant = req.headers['x-brand']
  }

  if(substitute[tenant]) {
    tenant = substitute[tenant]
  }

  req.app.set('tenant', tenant)
  res.setHeader('x-brand', tenant)
  next()
}