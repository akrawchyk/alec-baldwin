module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emailJobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      data: Sequelize.JSON,

      template: {
        allowNull: false,
        type: Sequelize.STRING
      },

      displayHash: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

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

      jobId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'jobs',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      // timestamps
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('emailJobs')
  },
}
