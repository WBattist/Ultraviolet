const express = require('express');
const fetch = require('node-fetch');
const cache = require('./cache');
const compression = require('./compression');

module.exports = (app) => {
    app.use(compression);

    app.get('/proxy', cache, async (req, res) => {
        const { url } = req.query;
        const response = await fetch(url);
        const body = await response.text();

        cache.setCache(url, body);
        res.send(body);
    });
};
