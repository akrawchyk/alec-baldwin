const UNPROCESSED = 'UNPROCESSED'
const PROCESSED = 'PROCESSED'
const ERRORED = 'ERRORED'

const STATUSES = {
  UNPROCESSED,
  PROCESSED,
  ERRORED,
}

module.exports = function(sequelize, DataTypes) {
  const Transaction = sequelize.define('transaction', {
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

  Transaction.STATUSES = STATUSES

  return Transaction
}
