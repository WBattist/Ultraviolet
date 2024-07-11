const fs = require('fs');

module.exports = {
    key: fs.readFileSync('../server.key'),
    cert: fs.readFileSync('../server.cert'),
    ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:!RC4:!MD5:!aNULL',
    honorCipherOrder: true
};
