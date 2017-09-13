const app = require('./app')
const db = require('./db')

app(async function beforeHooks(instance) {
  // TODO inject config
  // const config = await config()
  // instance.context.config = config
  // XXX temporary poc/workaround for config,
  // consider issues with exposing secret config on the ctx
  instance.context.ALLOWED_HOSTS = process.env.ALLOWED_HOSTS
    .split(',')
    .map(h => h.trim())

  // inject db
  instance.context.db = await db(process.env.DATABASE_URL)

  // XXX register hooks on model actions http://docs.sequelizejs.com/manual/tutorial/hooks.html

}).then(instance => {
  instance.listen(process.env.PORT)
  console.log(`Listening on port ${process.env.PORT}`)
})
