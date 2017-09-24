function show() {
  return async function(ctx, next) {
    const displayHash = ctx.params.id

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

    ctx.state.locals = emailJob.data

    await next()
  }
}


module.exports = {
  show
}
