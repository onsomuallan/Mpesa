const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const https = require('https');

// M-Pesa credentials
const consumerKey = 'imjTOYOWM3wj0LZGxdElAwOgGrM3wo10';  // Replace with your consumer key
const consumerSecret = 'xBWaTyRMGaI7QACr';  
const shortCode = 174379;
const lipaNaMpesaOnlinePassKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

// Function to generate access token
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

        // Convert amount to string and format accordingly (in cents or smallest unit)
        const formattedAmount = totalAmount.toFixed(0); // Adjust if necessary based on your currency and API requirements

        const postData = JSON.stringify({
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: formattedAmount,
          PartyA: 600992, // This should ideally be the phone number initiating the request
          PartyB: shortCode, // Paybill Number/ Till
          PhoneNumber: phoneNumber,
          CallBackURL: 'https://example.com',
          AccountReference: 'CompanyXLTD',
          TransactionDesc: 'Payment of X'
        });

        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

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
            resolve(JSON.parse(data));
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



// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method.toUpperCase() === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle POST request to /api/stkpush
  if (trimmedPath === 'api/stkpush' && req.method.toUpperCase() === 'POST') {
    let buffer = '';
    const decoder = new StringDecoder('utf-8');
    req.on('data', (data) => {
      buffer += decoder.write(data);
    });
    req.on('end', () => {
      buffer += decoder.end();

      const data = JSON.parse(buffer);

      makeSTKPushRequest(data)
        .then(response => {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(JSON.stringify(response));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
        });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start the server
server.listen(5000, () => {
  console.log('Server running on port 5000');
});
