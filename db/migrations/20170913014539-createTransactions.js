module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      status: {
        type: Sequelize.ENUM,
        values: ['UNPROCESSED', 'PROCESSED', 'ERRORED'],
        defaultValue: 'UNPROCESSED',
      },

      // timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions')
  },
}
