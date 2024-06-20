// backend/utils/httpUtils.js
const http = require('http');

const createServer = (requestListener) => {
  return http.createServer(requestListener);
};

module.exports = {
  createServer
};
