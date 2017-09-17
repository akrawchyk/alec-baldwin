const Koa = require('koa')
const Router = require('koa-trie-router')
const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate

const router = new Router()
  .get('/', ctx => {
    ctx.body = 'Emails index'
  })
  .post('/', async (ctx, next) => {
    const body = ctx.request.body

    // email is validated on the model
    const email = await ctx.db.email
      .findOrCreate({ where: { address: body.emailAddress } })
      .spread((email, created) => email.get({ plain: true }))
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
    const transactionId = transaction.get('id')
    const emailTransaction = await ctx.db.emailTransaction
      .create({
        transactionId,
        emailId: email.id,
        data,
      })
      .then(emailTxn => emailTxn.get({ plain: true }))

    const sendEmail = require('./workers/smtp.js')

    try {
      const result = await sendEmail(
        'transactional',
        {
          to: email.address,
          subject: "Today's Swim: RP10",
        },
        {
          intro: 'This is your test email!',
          body: 'Check out this sweet body content!',
          permalink: `https://localhost:4000/emails/show/${emailTransaction.displayHash}`,
          outro: 'And even an outro!',
        }
      )
      transaction.set('status', ctx.db.transaction.STATUSES.PROCESSED)
      ctx.body = { message: 'Success!' }
    } catch (err) {
      console.error(err)
      transaction.set('status', ctx.db.transaction.STATUSES.ERRORED)
    }

    await next()

    await transaction.save()
  })
  .get('/show/:displayHash', async function(ctx, next) {
    const displayHash = ctx.params.displayHash

    // TODO get seconds data to format
    const emailTransaction = await ctx.db.emailTransaction
      .findOne({
        where: { displayHash },
        attributes: ['data'],
        include: ['email'],
      })
      .then(emailTxn => {
        return emailTxn.get({ plain: true })
      })
      .catch(err => {
        console.error(err)
        ctx.throw(404, 'Email not found')
      })

    console.log(emailTransaction)

    // TODO encapsulate this in a function to share with smtp worker
    // generate email and display
    const templatesDir = path.resolve(__dirname, 'templates')
    const template = new EmailTemplate(path.join(templatesDir, 'transactional'))

    // nunjucks config
    const settings = {
      views: path.join(templatesDir, 'transactional'),
    }
    // An example users object with formatted email function
    const locals = {
      settings,

      to: emailTransaction.email.address,
      subject: "Today's Swim: RP10",
      intro: 'This is your test email!',
      body: 'Check out this sweet body content!',
      permalink: `https://localhost:4000/emails/${emailTransaction.displayHash}`,
      outro: 'And even an outro!',
    }

    ctx.body = await template.render(locals).then(rendered => rendered.html)

    await next()
  })

module.exports = router
