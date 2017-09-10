const app = require('./app')
const db = require('./db')

// inject db
app(db).listen(process.env.PORT)
