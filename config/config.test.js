var config = {
    db: 'mongodb://localhost:27017/gigplanner-test',
    port: process.env.PORT || 8081
};

config.url = 'http://localhost:' + config.port;
config.test = null;

module.exports = config;