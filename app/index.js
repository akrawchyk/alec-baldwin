const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const mount = require('koa-mount')
const helmet = require('koa-helmet')
const Koa = require('koa')
const Router = require('koa-trie-router')
const emails = require('./emails')

module.exports = async function(beforeHooks) {
  const app = new Koa()
  const router = new Router()

  await beforeHooks(app)

  const corsConfig = {
    origin: ctx => {
      // compare origin against ALLOWED_HOSTS
      const origin = ctx.get('Origin')

      if (ctx.ALLOWED_HOSTS.includes(origin)) {
        return origin
      }
    },
  }

  app.use(helmet())
  app.use(cors(corsConfig))
  app.use(bodyParser())

  if (process.env.NODE_ENV !== 'production') {
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
