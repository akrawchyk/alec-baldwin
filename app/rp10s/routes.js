const Koa = require('koa')
const Router = require('koa-trie-router')
const sendEmail = require('../../smtp')
const { renderEmailTemplate } = require('../emails/views')

async function ensureEmail(ctx, next) {
  // email is validated on the model
  ctx.state.email = await ctx.db.email
    .findOrCreate({ where: { address: ctx.request.body.emailAddress } })
    .spread((email, created) => email)
    .catch(err => {
      console.error(err)
      ctx.throw(400, 'Unexpected email')
    })

  return next()
}

const router = new Router()
  .post('/new', ensureEmail, async (ctx, next) => {
    const body = ctx.request.body

    if (!body.goalTimes || !body.rp10) {
      ctx.throw(400, 'Unexpected data')
    } else {
      // sanitize data for sending in email?
    }

    const rp10 = await ctx.db.rp10
      .create({
        emailId: ctx.state.email.get('id'),
        data: {
          goalTimes: body.goalTimes,
          rp10: body.rp10,
        },
      })
      .catch(err => {
        console.error(err)
        ctx.throw(400, 'Unexpected data')
      })

    const job = await ctx.db.job.create()

    try {
      // TODO get content from i18n
      const data = {
        to: ctx.state.email.get('address'),
        subject: "Today's Swim: RP10",
        intro: 'This is your test email!',
        body: 'Check out this sweet body content!',
      }
      const emailJob = await ctx.db.emailJob
        .create({
          jobId: job.get('id'),
          emailId: ctx.state.email.get('id'),
          data,
          template: 'rp10'
        })

      // define content somewhere else, retrieve by template name
      const rendered = await renderEmailTemplate(emailJob.get('template'), {
        ...data,
        permalink: `https://${process.env.SITE_DOMAIN}/emails/${emailJob.displayHash}`
      })

      const envelope = {
        from: process.env.SMTP_ENVELOPE_FROM,
        subject: 'i18n[templateName]',
        to: ctx.state.email.get('address'),
        html: rendered.html,
        text: rendered.text
      }

      const attachments = []

      await sendEmail({ ...envelope, attachments })

      ctx.body = { message: 'Success' }
      job.status = ctx.db.job.STATUSES.PROCESSED
    } catch (err) {
      console.error(err)
      job.status = ctx.db.job.STATUSES.ERRORED
      ctx.throw(500)
    }

    job.save()
    await next()
  })

module.exports = router
