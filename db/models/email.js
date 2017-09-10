module.exports = function(sequelize, DataTypes) {
  const Email = sequelize.define('email', {
    email: DataTypes.STRING,
  })

  return Email
}
