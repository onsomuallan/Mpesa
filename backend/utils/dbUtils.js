// backend/utils/dbUtils.js
const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

const connectToDB = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Connected to MSSQL database');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

module.exports = {
  connectToDB
};
