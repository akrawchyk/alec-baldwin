module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emailTransactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      data: Sequelize.JSON,

      emailId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'emails',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'transactions',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      // timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('emailTransactions')
  },
}
