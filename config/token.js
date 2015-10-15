module.exports.secret = "a01ECqv~\eY5v&";

module.exports.send = function(req, res, next) {
    var token = req.user.createToken();
    res.set('Authorization', token);
    next();
};