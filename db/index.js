const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
let db = null
const modelsPath = 'models'

module.exports = async function() {
  if (db) {
    return db
  }

  const sequelize = new Sequelize(process.env.DATABASE_URL)

  await sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');

      db = {}

      // XXX: model files finders
      // import db files
      fs
        .readdirSync(path.join(__dirname, modelsPath))
        .filter(file => {
          return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
        })
        .forEach(file => {
          var model = sequelize.import(path.join(__dirname, modelsPath, file))
          db[model.name] = model
        })

      // make associations
      Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
          db[modelName].associate(db)
        }
      })

      db.sequelize = sequelize
      db.Sequelize = Sequelize

      Object.freeze(db)
    })
    .catch(err => {
      throw err
    })

  return db
}
