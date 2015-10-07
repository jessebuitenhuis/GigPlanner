var db = require('../config/db');

exports.get = function(type, cb) {
    db.view(type, 'all', function(error, body){
        if (error) return cb(error);
        var results = [];
        body.rows.forEach(function(row){
            results.push(row.value);
        });
        cb(error, results);
    });
};
exports.find = db.get;
exports.create = function(type, item, cb) {
    item.type = type;
    db.insert(item, function(error, body){
        if (error) return cb(error);
        db.get(body.id, cb);
    });
};
exports.update = function(type, item, cb) {
    db.get(item._id, function (error, existing) {
        if (!error) item._rev = existing._rev;
        item.type = type;
        db.insert(item, item._id, function(error, body){
            if (error) return cb(error);
            db.get(item._id, cb);
        });
    });
};
exports.remove = function(id, cb){
    if (!id) return cb(new Error('No id provided'));
    db.get(id, function(error, body){
        if (error) return cb(new Error('No document found'));
        db.destroy(id, body._rev, cb);
    });
};