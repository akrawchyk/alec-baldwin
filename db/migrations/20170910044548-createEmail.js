module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emails', {
      email: Sequelize.STRING,

      // timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('emails')
  },
}
