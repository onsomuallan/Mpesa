const https = require('https');
const { consumerKey, consumerSecret } = require('../config/mpesaConfig');

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
        try {
          const tokenResponse = JSON.parse(data);
          const accessToken = tokenResponse.access_token;
          resolve(accessToken);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

const checkTransactionStatus = (transactionID) => {
  return new Promise((resolve, reject) => {
    getToken()
      .then(accessToken => {
        const options = {
          hostname: 'sandbox.safaricom.co.ke',
          path: `/mpesa/transactionstatus/v1/query?TransactionID=${transactionID}`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              console.log('Response from M-Pesa API:', response); // Log the entire response for detailed information
              const transactionStatus = response.ResultCode === 0 ? 'Completed' : 'Failed';
              resolve(transactionStatus);
            } catch (error) {
              reject(error);
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.end();
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Function to repeatedly check transaction status every 3 seconds
const checkTransactionStatusRepeatedly = (transactionID) => {
  setInterval(() => {
    checkTransactionStatus(transactionID)
      .then(status => {
        console.log(`Transaction status: ${status}`);
      })
      .catch(error => {
        console.error('Error checking transaction status:', error);
      });
  }, 3000); // 3000 milliseconds = 3 seconds
};

// Example usage
const transactionID = 'ws_CO_20062024144114958718356070'; // Replace with an actual transaction ID
checkTransactionStatusRepeatedly(transactionID);
