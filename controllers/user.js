var User = require('../models/user');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/users', router);

    router.get('/', function(req, res, next) {
        User.find({}, function (err, users) {
            if (err) return next(err);
            res.send(users);
        });
    });
    router.get('/:id', function(req, res, next){
        User.findById(req.params.id, function (err, user) {
            if (err) return next(err);
            if (!user) return res.sendStatus(404);
            res.send(user);
        });
    });
    router.post('/', function(req, res, next){
        var newUser = new User(req.body);
        newUser.save(function(err, user){
            if (err) return next(err);
            res.send(user);
        });
    });
    router.put('/:id?', function(req, res, next){
        User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, user){
            if (err) return next(err);
            res.send(user);
        });
    });
    router.delete('/:id', function(req, res, next){
        User.findByIdAndRemove(req.params.id, function(err){
            if (err) return next(err);
            res.sendStatus(204);
        });
    });
};