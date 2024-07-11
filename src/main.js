const express = require('express');
const app = express();
const cache = require('./cache');
const compression = require('./compression');

// Middleware and routes setup
app.use(compression);
app.use(cache);

// Include existing files
require('./uv.config.js')(app);
require('./uv.handler.js')(app);
require('./uv.sw.js')(app);
require('./client')(app);
require('./rewrite')(app);

// Additional middleware and routes
require('./app')(app);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
