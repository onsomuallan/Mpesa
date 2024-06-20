// backend/services/mpesaService.js
const https = require('https');
const { consumerKey, consumerSecret, shortCode, lipaNaMpesaOnlinePassKey } = require('../config/mpesaConfig');
const Transaction = require('../models/transactionModel');
const sequelize = require('../config/sequelizeConfig');

const getToken = () => {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const options = {
      hostname: 'sandbox.safaricom.co.ke',
      path: '/oauth/v1/generate?grant_type=client_credentials',
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const tokenResponse = JSON.parse(data);
        const accessToken = tokenResponse.access_token;
        resolve(accessToken);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

const makeSTKPushRequest = ({ phoneNumber, totalAmount }) => {
  return new Promise((resolve, reject) => {
    getToken()
      .then(accessToken => {
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(`${shortCode}${lipaNaMpesaOnlinePassKey}${timestamp}`).toString('base64');

        const formattedAmount = totalAmount.toFixed(0);

        const postData = JSON.stringify({
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: formattedAmount,
          PartyA: phoneNumber,
          PartyB: shortCode,
          PhoneNumber: phoneNumber,
          CallBackURL: 'https://example.com',
          AccountReference: 'Paypal Limited',
          TransactionDesc: 'Purchase of Items'
        });

        const options = {
          hostname: 'sandbox.safaricom.co.ke',
          path: '/mpesa/stkpush/v1/processrequest',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            const response = JSON.parse(data);

            // Save transaction to database
            const transactionData = {
              TransactionID: response.CheckoutRequestID,
              PhoneNumber: phoneNumber,
              Amount: formattedAmount,
              Status: 'Pending'
            };

            Transaction.create(transactionData)
              .then(() => resolve(response))
              .catch(error => reject(error));
          });
        });

        req.on('error', (e) => {
          reject(e);
        });

        req.write(postData);
        req.end();
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  makeSTKPushRequest
};
