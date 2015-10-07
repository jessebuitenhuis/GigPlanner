var crud = require('../helpers.crud');

exports.get = function(cb){
    crud.get('bands', cb);
};
exports.find = crud.get;
exports.create = function(band, cb) {
    crud.create('Band', band, cb);
};
exports.update = function(band, cb) {
    crud.update('Band', band, cb);
};
exports.remove = crud.remove;