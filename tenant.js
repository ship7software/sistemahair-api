let substitute = {}
substitute['127.0.0.1'] = 'localhost'

module.exports = (req, res, next) => {
  let tenant = req.hostname
  console.log(req.headers)
  if(req.headers && req.headers['X-BRAND']){
    tenant = req.headers['X-BRAND']
  }

  req.app.set('tenant', tenant)
  res.setHeader('X-BRAND', tenant)
  next()
}