module.exports = function(sequelize, DataTypes) {

  const Email = sequelize.define('email', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: DataTypes.STRING,
  })

  Email.associate = function(db) {
    Email.hasMany(db.EmailTransaction)
  }

  return Email
}
