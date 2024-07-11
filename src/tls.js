const fs = require('fs');
const tls = require('tls');
const options = require('../config/tls-options');

const server = tls.createServer(options, (socket) => {
    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(socket);
});

server.listen(8000, () => {
    console.log('TLS server running on port 8000');
});
