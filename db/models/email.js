module.exports = function(sequelize, DataTypes) {
  const email = sequelize.define('email', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    address: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  })

  email.associate = function(models) {
    email.hasMany(models.emailJob)
  }

  return email
}
