module.exports = function(sequelize, DataTypes) {
  const emailJob = sequelize.define('emailJob', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    data: DataTypes.JSON,

    template: DataTypes.STRING,

    displayHash: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    emailId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'email',
        key: 'id',
      }
    },

    jobId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'job',
        key: 'id',
      }
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  })

  emailJob.associate = function(models) {
    emailJob.belongsTo(models.job)
    emailJob.belongsTo(models.email)
  }

  return emailJob
}
