const http2 = require('http2');
const fs = require('fs');
const express = require('express');
const app = express();

const server = http2.createSecureServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);

require('./app')(app);

server.listen(3000, () => {
    console.log('HTTP/2 server running on port 3000');
});
