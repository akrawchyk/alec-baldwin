module.exports = (sequelize, DataTypes) => {
  const rp10 = sequelize.define('rp10', {
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
      }
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  })

  rp10.associate = function(models) {
    // associations can be defined here
  }

  return rp10
};
