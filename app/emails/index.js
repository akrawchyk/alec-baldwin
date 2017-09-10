const Koa = require('koa')
const Router = require('koa-trie-router')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const router = new Router()
  .get('/', ctx => {
    ctx.body = 'Emails index'
  })
  .post('/', async (ctx, next) => {
    const body = ctx.request.body
    ctx.body = { data: body }
    // TODO validate email or throw 400
    await ctx.db.email
      .findOrCreate({ where: { email: body.email } })
      .catch(err => {
        throw err
      })
    await next()
    // TODO send email
  })

// show email by name/hash?

module.exports = router
