var crud = require('../helpers/crud');

exports.get = function(cb) {
    crud.get('users', cb);
};
exports.find = crud.find;
exports.create = function(user, cb) {
    crud.create('User', user, cb);
};
exports.update = function(user, cb) {
    crud.update('User', user, cb);
};
exports.remove = crud.remove;