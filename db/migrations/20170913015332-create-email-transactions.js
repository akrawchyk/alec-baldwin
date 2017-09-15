module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emailTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      data: Sequelize.JSON,

      emailId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'emails',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      transactionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'transactions',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      // timestamps
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('emailTransactions')
  },
}
