const Koa = require('koa')
const Router = require('koa-trie-router')

const router = new Router()
  .post('/new', async (ctx, next) => {
    const body = ctx.request.body

      console.log(body)
    if (!body.goalTimes || !body.rp10) {
      ctx.throw(400, 'Unexpected data')
    }

    // email is validated on the model
    const email = await ctx.db.email
      .findOrCreate({ where: { address: body.emailAddress } })
      .spread((email, created) => email.get({ plain: true }))
      .catch(err => {
        console.error(err)
        ctx.throw(400, 'Unexpected email')
      })

    const rp10 = await ctx.db.rp10.create({
      emailId: email.id,
      data: {
        goalTimes: body.goalTimes,
        rp10: body.rp10
      }
    })
      .catch(err => {
        console.error(err)
        ctx.throw(400, 'Unexpected data')
      })

    // TODO send email

    ctx.body = { message: 'Success' }
    await next()
  })

module.exports = router
