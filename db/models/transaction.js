const UNPROCESSED = 'UNPROCESSED'
const PROCESSED = 'PROCESSED'
const ERRORED = 'ERRORED'

const STATUSES = {
  UNPROCESSED,
  PROCESSED,
  ERRORED,
}

module.exports = function(sequelize, DataTypes) {
  const transaction = sequelize.define('transaction', {
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

  // FIXME is there a prototype method for this or something?
  transaction.STATUSES = STATUSES

  return transaction
}
