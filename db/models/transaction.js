const UNPROCESSED = 'UNPROCESSED'
const PROCESSED = 'PROCESSED'
const ERRORED = 'ERRORED'

const STATUSES = {
  UNPROCESSED,
  PROCESSED,
  ERRORED
}

module.exports = function(sequelize, DataTypes) {

  const Transaction = sequelize.define('transaction', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: DataTypes.ENUM(...Object.keys(STATUSES)),
  })

  Transaction.STATUSES = STATUSES

  return Transaction
}
