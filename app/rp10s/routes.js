const Koa = require('koa')
const Router = require('koa-trie-router')
const sendEmail = require('../../smtp')
const { renderEmailTemplate } = require('../emails/views')
const { formatDurationDisplay, toSecondsProFormat } = require('./helpers')

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

const router = new Router().post('/new', ensureEmail, async (ctx, next) => {
  const body = ctx.request.body

  if (!body.goalTimes || !body.rp10) {
    ctx.throw(400, 'Unexpected data')
  }

  const [ rp10, goalTimes ] = await ctx.db.rp10
    .create({
      emailId: ctx.state.email.get('id'),
      data: {
        goalTimes: body.goalTimes,
        rp10: body.rp10,
      },
    })
    .then(rp10 => {
      const data = rp10.get({ plain: true }).data
      return [data.rp10, data.goalTimes]
    })
    .catch(err => {
      console.error(err)
      ctx.throw(400, 'Unexpected data')
    })

  const job = await ctx.db.job.create()

  try {
    console.log(rp10)

    const data = {
      to: ctx.state.email.get('address'),
      subject: "RP10: Today's swim",

      intro: `All groups: ${rp10.repCount}x${rp10.todaysRepeats} (${rp10.restPerRepeat}s rest at ${rp10.percentGoalPaceToTrainToday}%)`,

      body: goalTimes.map((goalTime, idx) => {
        const name = goalTime.name || `Group ${idx + 1}`
        const totalSetTime = goalTime.interval * rp10.repCount
        const goalPoolType = rp10.myGoalTimeIsFor[
          rp10.myGoalTimeIsFor.length - 1
        ].toLowerCase()

        return `
        ${name}
        <br>
        Target: ${formatDurationDisplay(goalTime.target)} - Interval @ ${formatDurationDisplay(goalTime.interval)}
        <br>
        Goal time: ${goalTime.distance}${goalPoolType} @ ${formatDurationDisplay(goalTime.duration)}
        <br>
        Total set time: ${formatDurationDisplay(totalSetTime)}`
      }).join('<br/><br/>')
    }

    const emailJob = await ctx.db.emailJob.create({
      jobId: job.get('id'),
      emailId: ctx.state.email.get('id'),
      data,
      template: 'rp10',
    })

    const rendered = await renderEmailTemplate(emailJob.get('template'), {
      ...data,
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
