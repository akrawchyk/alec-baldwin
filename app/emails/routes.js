const Koa = require('koa')
const Router = require('koa-trie-router')
const renderEmailTemplate = require('../../email').renderEmailTemplate

const router = new Router()
  .get('/show/:displayHash', async function(ctx, next) {
    const displayHash = ctx.params.displayHash

    // TODO how to get seconds attachments to render?
    const emailTransaction = await ctx.db.emailTransaction
      .findOne({
        where: { displayHash },
        include: ['email'],
      })
      .then(emailTxn => {
        return emailTxn.get({ plain: true })
      })
      .catch(err => {
        console.error(err)
        ctx.throw(404, 'Not found')
      })

    const rendered = await renderEmailTemplate(emailTransaction.template,
      {
        to: emailTransaction.email.address,
        subject: "Today's Swim: RP10",
      },
      {
        intro: 'This is your test email!',
        body: 'Check out this sweet body content!',
      }
    )

    ctx.body = envelope.html

    await next()
  })

module.exports = router
