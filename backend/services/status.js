const https = require('https');

// Configuration - replace with your actual configuration
const { consumerKey, consumerSecret, shortCode, lipaNaMpesaOnlinePassKey } = require('../config/mpesaConfig'); // Adjust path as necessary

// Function to get OAuth Access Token
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

// Function to check transaction status
const checkTransactionStatus = (transactionId, accessToken) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      BusinessShortCode: shortCode,
      Password: lipaNaMpesaOnlinePassKey, // Adjust as per API requirements
      Timestamp: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3),
      CheckoutRequestID: transactionId
    });

    const options = {
      hostname: 'sandbox.safaricom.co.ke',
      path: '/mpesa/stkpushquery/v1/query',
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
        resolve(response);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    // Send the POST request with the payload data
    req.write(postData);
    req.end();
  });
};

// Main function to continuously check transaction status
const transactionId = 'ws_CO_19062024151214094718356070'; // Replace with the actual transaction ID
const interval = 10000; // Interval in milliseconds (10 seconds)

const checkStatusRepeatedly = () => {
  getToken()
    .then(accessToken => {
      return checkTransactionStatus(transactionId, accessToken);
    })
    .then(response => {
      console.log(`Transaction ID: ${transactionId}, Status: ${response.ResultDesc}`);
    })
    .catch(error => {
      console.error('Error checking transaction status:', error);
    });
};

// Initial check and start interval
checkStatusRepeatedly();
setInterval(checkStatusRepeatedly, interval);
