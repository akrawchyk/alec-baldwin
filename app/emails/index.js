const Koa = require('koa')
const Router = require('koa-trie-router')
const bodyParser = require('koa-bodyparser')

const router = new Router()
  .use(bodyParser())
  .get('/', ctx => {
    ctx.body = 'Emails index'
  })
  .post('/', ctx => {
    ctx.body = ctx.request.body
  })

// show email by name/hash?

module.exports = router
