// backend/models/transactionModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Transaction = sequelize.define('Transaction', {
  TransactionID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Transactions',
  timestamps: false // Disable Sequelize's automatic timestamps
});

module.exports = Transaction;
