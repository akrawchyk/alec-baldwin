const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const mount = require('koa-mount')
const Koa = require('koa')
const Router = require('koa-trie-router')
const emails = require('./emails')

module.exports = function(db) {
  const app = new Koa()
  const router = new Router()

  db().then(db => app.context.db = db)

  app.use(cors({
    origin: 'http://localhost:4200'
  }))
  app.use(bodyParser())

  // XXX: register models?

  if (process.env.NODE_ENV === 'development') {
    // x-response-time
    app.use(async (ctx, next) => {
      const start = Date.now()
      await next()
      const ms = Date.now() - start
      ctx.set('X-Response-Time', `${ms}ms`)
    })

    // logger
    app.use(async (ctx, next) => {
      const start = Date.now()
      await next()
      const ms = Date.now() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  }

  router.get('/', ctx => {
    ctx.body = 'Hello World'
  })

  app.use(mount('/', router.middleware()))
  app.use(mount('/emails', emails.middleware()))

  return app
}
