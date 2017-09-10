module.exports = function(sequelize, DataTypes) {
  const Email = sequelize.define('Email', {
    email: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1
    }
  })

  return Email
}
