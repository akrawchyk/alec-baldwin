const UNPROCESSED = 'UNPROCESSED'
const PROCESSED = 'PROCESSED'
const ERRORED = 'ERRORED'

const STATUSES = {
  UNPROCESSED,
  PROCESSED,
  ERRORED,
}

module.exports = function(sequelize, DataTypes) {
  const job = sequelize.define('job', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    status: {
      type: DataTypes.ENUM,
      values: Object.keys(STATUSES),
      defaultValue: UNPROCESSED,
    },
  })

  job.STATUSES = STATUSES

  return job
}
