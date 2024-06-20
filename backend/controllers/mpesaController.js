// backend/controllers/mpesaController.js

const Transaction = require('../models/transactionModel');
const mpesaService = require('../services/mpesaService');

// Fetch all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};


const makeSTKPushRequest = (req, res) => {
  const { phoneNumber, totalAmount } = req.body;
  mpesaService.makeSTKPushRequest({ phoneNumber, totalAmount })
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    });
};

module.exports = {
  getTransactions,
  makeSTKPushRequest
};
