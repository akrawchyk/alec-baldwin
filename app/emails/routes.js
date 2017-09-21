const Koa = require('koa')
const Router = require('koa-trie-router')
const { renderEmailTemplate } = require('./views')

const router = new Router()
  .get('/:displayHash', async function(ctx, next) {
    const displayHash = ctx.params.displayHash

    // TODO how to get seconds attachments to render?
    const emailJob = await ctx.db.emailJob
      .findOne({
        where: { displayHash },
        include: ['email'],
      })
      .then(emailTxn => emailTxn.get({ plain: true }))
      .catch(err => {
        console.error(err)
        ctx.throw(404, 'Not found')
      })

    const data = {
      to: emailJob.email.address,
      subject: "Today's Swim: RP10",
      intro: 'This is your test email!',
      body: 'Check out this sweet body content!',
    }

    const rendered = await renderEmailTemplate(emailJob.template, data)

    ctx.body = rendered.html

    await next()
  })

module.exports = router
