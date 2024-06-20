// backend/routes/mpesaRoutes.js
const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');

router.post('/stkpush', mpesaController.makeSTKPushRequest);
router.get('/transactions', mpesaController.getTransactions);

module.exports = router;
