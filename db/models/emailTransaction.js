module.exports = function(sequelize, DataTypes) {
  const emailTransaction = sequelize.define('emailTransaction', {
    id: {
      type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
    },

    data: DataTypes.JSON,

    displayHash: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    emailId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'email',
        key: 'id',
      },
      allowNull: false,
    },

    transactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'transaction',
        key: 'id',
      },
      allowNull: false,
    },
  })

  emailTransaction.associate = function(models) {
    emailTransaction.belongsTo(models.transaction)
    emailTransaction.belongsTo(models.email)
  }

  return emailTransaction
}
