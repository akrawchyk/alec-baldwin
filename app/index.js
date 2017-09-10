const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const mount = require('koa-mount')
const Koa = require('koa')
const Router = require('koa-trie-router')
const db = require('../models')
const emails = require('./emails')

const app = new Koa()
const router = new Router()

app.use(cors({
  origin: 'http://localhost:4200'
}))
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

module.exports = app
