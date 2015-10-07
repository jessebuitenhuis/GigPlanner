var nano        = require('nano')('http://localhost:5984'),
    db          = nano.db.use('gigplanner');

module.exports = db;
