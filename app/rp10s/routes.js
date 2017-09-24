const Koa = require('koa')
const Router = require('koa-trie-router')
const sendEmail = require('../../smtp')
const { formatDurationDisplay, toSecondsProFormat } = require('./helpers')
const { renderEmailTemplate } = require('../emails/views')
const { ensureEmail, rp10Form } = require('./views')

const router = new Router()
  .post('/v2', ensureEmail, async (ctx, next) => {

  })

  .post('/',
    ensureEmail(),
    rp10Form(),
    async (ctx, next) => {
      console.log(rp10)

      const data = {
        ctx.state.locals.rp10,
        ctx.state.locals.goalTimes,

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

      ctx.state.locals = data

      await next()
    })

module.exports = router
