const Router = require('koa-trie-router')
const { renderEmailTemplate, htmlEmail } = require('./middleware')
const { show } = require('./views')

const router = new Router()

router.get('/:id',
  show(),
  renderEmailTemplate('rp10'),
  htmlEmail()
)

module.exports = router
