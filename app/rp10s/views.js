function rp10Form() {
  return async function(ctx, next) {
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

    ctx.state.locals = { rp10, goalTimes }

    await next()
  }
}
