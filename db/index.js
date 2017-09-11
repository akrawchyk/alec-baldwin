const fs = require('fs')
const path = require('path')
const util = require('util')
const Sequelize = require('sequelize')
let db = null

module.exports = async function(databaseUrl) {
  if (db) {
    return db
  }

  const sequelize = new Sequelize(databaseUrl)

  return await sequelize
    .authenticate()
    .then(async () => {
      console.log('Connection has been established successfully.')

      db = {}

      // import db files
      const modelsPath = 'models'
      const basename = path.basename(module.filename)
      const readdirAsync = util.promisify(fs.readdir)
      const files = await readdirAsync(path.join(__dirname, modelsPath))

      files
        .filter(file => {
          return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
          )
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

      return db
    })
    .catch(err => {
      throw err
    })
}
