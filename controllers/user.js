var User = require('../models/user'),
    _ = require('underscore');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/users', router);

    router.get('/', function(req, res, next) {
        if (req.query.view == 'linked' && req.query.event) {
            User.findLinkedToEvent(req.query.event, function(err, users){
                if (err) return next(err);

                return res.status(200).send(users);
            });
        } else {
            User.find({}, function (err, users) {
                if (err) return next(err);
                return res.send(users);
            });
        }
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
        var data = _.omit(req.body, '_id');
        User.findByIdAndUpdate(req.body._id, data, {new: true}, function(err, user){
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