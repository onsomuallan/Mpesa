// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const mpesaRoutes = require('./routes/mpesaRoutes');
const { connectToDB } = require('./utils/dbUtils');
const sequelize = require('./config/sequelizeConfig');
const Transaction = require('./models/transactionModel');

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method.toUpperCase() === 'OPTIONS') {
    res.sendStatus(204); // No content response for OPTIONS requests
  } else {
    next(); // Pass control to the next middleware
  }
});

// Routes
app.use('/api', mpesaRoutes);

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Sequelize models synchronized with database');
  })
  .catch(err => {
    console.error('Sequelize synchronization error:', err);
  });

// Start the server after connecting to the database
connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit the process if database connection fails
  });
