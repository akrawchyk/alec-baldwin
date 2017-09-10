const app = require('./app')
const db = require('./db')

// inject db
app(db).then(app => app.listen(process.env.PORT))
