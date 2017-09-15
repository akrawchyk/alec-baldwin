module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      status: {
        allowNull: false,
        defaultValue: 'UNPROCESSED',
        type: Sequelize.ENUM,
        values: ['UNPROCESSED', 'PROCESSED', 'ERRORED'],
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
    return queryInterface.dropTable('transactions')
  },
}
