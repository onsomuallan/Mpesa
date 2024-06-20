// backend/controllers/mpesaController.js
const mpesaService = require('../services/mpesaService');

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
  makeSTKPushRequest
};
