module.exports = function(sequelize, DataTypes) {
  const Email = sequelize.define('email', {
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

  Email.associate = function(db) {
    Email.hasMany(db.emailTransaction)
  }

  return Email
}
