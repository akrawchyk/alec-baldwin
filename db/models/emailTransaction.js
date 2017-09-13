module.exports = function(sequelize, DataTypes) {

  const EmailTransaction = sequelize.define('emailTransaction', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    data: DataTypes.JSON,

    emailId: {
      type: sequelize.INTEGER
      references: {
        model: 'email',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },

    transactionId: {
      type: sequelize.INTEGER
      references: {
        model: 'transaction',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    }
  })

  EmailTransaction.associate = function(db) {
    EmailTransaction.belongsTo(db.Transaction)
    EmailTransaction.belongsTo(db.Email)
  }

  return EmailTransaction
}
