function ensureEmail() {
  return async function (ctx, next) {
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
}

function sendEmailJob() {
  return async function(ctx, next) {
    const job = await ctx.db.job.create()
    const emailJob = await ctx.db.emailJob.create({
      jobId: job.get('id'),
      emailId: ctx.state.email.get('id'),
      ctx.state.locals,
      template: 'rp10',
    }).then(emailJob => emailJob.get({ plain: true }))

    // TODO how to make this work as a middleware/renderware?
    const rendered = await renderEmailTemplate(emailJob.template, {
      ...ctx.state.locals,
      permalink: `https://${process.env.SITE_DOMAIN}/emails/${emailJob.displayHash}`,
    })

    const envelope = {
      from: process.env.SMTP_ENVELOPE_FROM,
      subject: data.subject,
      to: data.to,
      html: rendered.html,
      text: rendered.text,
    }

    const attachments = toSecondsProFormat(rp10, goalTimes).map(secondsPro => {
      return {
        filename: `${secondsPro.name.replace(' ', '_')}.seconds`,
        content: JSON.stringify(secondsPro),
        contentType: 'application/octet-stream',
      }
    })

    try {
      await sendEmail({ ...envelope, attachments })
      job.status = ctx.db.job.STATUSES.PROCESSED
    } catch (err) {
      console.error(err)
      job.status = ctx.db.job.STATUSES.ERRORED
      ctx.throw(500)
    }

    job.save()
  }

  module.exports = {
    sendEmailJob,
    ensureEmail
  }
