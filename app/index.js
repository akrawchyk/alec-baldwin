const path = require('path')
const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const mount = require('koa-mount')
const helmet = require('koa-helmet')
const enforceHttps = require('koa-sslify')
const error = require('koa-error')
const Koa = require('koa')
const Router = require('koa-trie-router')
const emails = require('./emails/routes')
const rp10s = require('./rp10s/routes')

module.exports = async function(beforeHooks) {
  const app = new Koa()
  const router = new Router()

  await beforeHooks(app)

  const corsConfig = {
    origin: ctx => {
      // compare origin against ALLOWED_CORS_ORIGINS
      const origin = ctx.get('Origin')

      if (ctx.ALLOWED_CORS_ORIGINS.includes(origin)) {
        return origin
      }
    },
  }

  if (process.env.NODE_ENV == 'production') {
    const sslifyConfig = {
      trustProtoHeader: true,
      specCompliantDisallow: true,
    }

    app.use(enforceHttps(sslifyConfig))
  }

  app.use(error({
    engine: 'nunjucks',
    template: path.join(__dirname, '../templates/error.nunjucks')
  }))
  app.use(helmet())
  app.use(cors(corsConfig))
  app.use(bodyParser())

  if (process.env.NODE_ENV != 'production') {
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

  app.use(mount(router.middleware()))
  app.use(mount('/emails', emails.middleware()))
  app.use(mount('/rp10s', rp10s.middleware()))

  return app
}
