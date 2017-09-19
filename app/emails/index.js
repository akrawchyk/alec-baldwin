const Koa = require('koa')
const Router = require('koa-trie-router')
const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate
const sendEmail = require('./workers/smtp.js')

async function getEmailEnvelope(templateName, toSubject, localData) {
  const templatesDir = path.resolve(__dirname, '../../templates/emails')
  const template = new EmailTemplate(path.join(templatesDir, 'transactional'))

  // nunjucks config
  const settings = {
    views: path.join(templatesDir, 'transactional'),
  }
  // email config and data
  const locals = {
    settings,

    ...toSubject,
    ...localData,
  }

  const rendered = await template.render(locals)

  return {
    to: toSubject.to,
    subject: toSubject.subject,
    html: rendered.html,
    text: rendered.text,
  }
}

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

      data.forEach(d => {
        if (!d.name || !d.seconds) {
          throw new TypeError('Unexpected data format')
        }
      })
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

    try {
      const emailContent = {
        // XXX
        intro: body.emailIntro,
        body: body.emailBody,
        // XXX
        permalink: `https://${process.env.SITE_DOMAIN}/emails/show/${emailTransaction.displayHash}`,
      }

      const envelope = await getEmailEnvelope(
        'transactional',
        {
          to: email.address,
          subject: "Today's Swim: RP10",
        },
        emailContent
      )

      const attachments = data.map(d => {
        return {
          filename: d.name,
          content: JSON.stringify(d.seconds),
          contentType: 'application/octet-stream',
        }
      })

      const result = await sendEmail({ ...envelope, attachments })
      transaction.set('status', ctx.db.transaction.STATUSES.PROCESSED)
      ctx.body = { message: 'Success!' }
    } catch (err) {
      console.error(err)
      transaction.set('status', ctx.db.transaction.STATUSES.ERRORED)
      ctx.throw(500, 'Transaction failed')
    }

    await next()

    await transaction.save()
  })
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
        ctx.throw(404, 'Email not found')
      })

    const envelope = await getEmailEnvelope(
      'transactional',
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
