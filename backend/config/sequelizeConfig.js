// backend/config/sequelizeConfig.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: process.env.SERVER,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      options: {
        encrypt: false, // For Microsoft SQL Server
        trustServerCertificate: true // For Microsoft SQL Server
      }
    },
    define: {
      timestamps: false // Disable Sequelize's automatic timestamps
    },
    timezone: '+00:00', // Set the timezone to UTC
  }
);

module.exports = sequelize;
