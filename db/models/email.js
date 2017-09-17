module.exports = function(sequelize, DataTypes) {
  const email = sequelize.define('email', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  })

  email.associate = function(models) {
    email.hasMany(models.emailTransaction)
  }

  return email
}
