const Koa = require('koa')
const Router = require('koa-trie-router')

const router = new Router()
  .get('/', ctx => {
    ctx.body = 'Emails index'
  })
  .post('/', async (ctx, next) => {
    const body = ctx.request.body
    // email is validated on the model
    const email = await ctx.db.email
      .findOrCreate({ where: { address: body.emailAddress } })
      .spread((email, created) => email)
      .catch(err => {
        ctx.throw(400, 'Unexpected email')
      })

    let data = body.data

    try {
      // ensure data is JSON formatted
      data = JSON.parse(data)
    } catch (err) {
      // send 400 error
      ctx.throw(400, 'Unexpected data')
    }

    ctx.body = { message: 'Success!' }

    await next()

    const transaction = await ctx.db.transaction.create()
    await ctx.db.emailTransaction.create({
      transactionId: transaction.get('id'),
      emailId: email.get('id'),
      data,
    })
  })

// show email by name/hash?

module.exports = router
