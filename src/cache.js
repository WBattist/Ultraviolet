const redis = require('redis');
const client = redis.createClient();

module.exports = (req, res, next) => {
    const { url } = req.query;

    client.get(url, async (err, data) => {
        if (err) throw err;

        if (data) {
            res.send(data);
        } else {
            next();
        }
    });
};

module.exports.setCache = (url, body) => {
    client.setex(url, 3600, body);
};
