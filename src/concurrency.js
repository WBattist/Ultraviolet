const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = express();

    // Include middleware and routes here
    require('./app')(app);

    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
