module.exports = function(sequelize, DataTypes) {
  const EmailTransaction = sequelize.define('emailTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    data: DataTypes.JSON,

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

  EmailTransaction.associate = function(db) {
    EmailTransaction.belongsTo(db.transaction)
    EmailTransaction.belongsTo(db.email)
  }

  return EmailTransaction
}
