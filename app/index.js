const Koa = require('koa')
const mount = require('koa-mount')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-trie-router')
const emails = require('./emails')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

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

router.get('/', ctx => {
  ctx.body = 'Hello World'
})

app.use(mount('/', router.middleware()))
app.use(mount('/emails', emails.middleware()))

app.listen(3000)
