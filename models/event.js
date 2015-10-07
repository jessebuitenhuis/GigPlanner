var crud = require('../helpers.crud');

exports.get = function(cb){
    crud.get('events', cb);
};
exports.find = crud.get;
exports.create = function(band, cb) {
    crud.create('Event', band, cb);
};
exports.update = function(band, cb) {
    crud.update('Event', band, cb);
};
exports.remove = crud.remove;