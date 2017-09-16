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

      // TODO validate rp10 seconds
    } catch (err) {
      // send 400 error
      ctx.throw(400, 'Unexpected data')
    }

    const transaction = await ctx.db.transaction.create()
    await ctx.db.emailTransaction.create({
      transactionId: transaction.get('id'),
      emailId: email.get('id'),
      data,
    })

    const sendEmail = require('./workers/smtp.js')

    try {
      const result = await sendEmail()
      transaction.set('status', ctx.db.transaction.STATUSES.PROCESSED)
      ctx.body = { message: 'Success!' }
    } catch(err) {
      console.error(err)
      transaction.set('status', ctx.db.transaction.STATUSES.ERRORED)
      await transaction.save()
      ctx.throw(500, 'Unexpected error occurred')
    }

    await next()

    await transaction.save()
  })

// show email by name/hash?

module.exports = router
