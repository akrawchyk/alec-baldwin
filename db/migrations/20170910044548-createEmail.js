module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      address: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('emails')
  },
}
