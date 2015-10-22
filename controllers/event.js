var Event = require('../models/event.js');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/events', router);

    router.get('/', function(req, res, next) {
        Event.find({}, function (err, events) {
            if (err) return next(err);
            res.send(events);
        });
    });
    router.get('/:id', function(req, res, next){
        Event.findById(req.params.id)
            .populate('users.user bands.band')
            .exec(function (err, event) {
                if (err) return next(err);

                res.send(event);
        });
    });
    router.post('/', function(req, res, next){
        var newEvent = new Event(req.body);
        newEvent.save(function(err, event){
            if (err) return next(err);
            res.send(event);
        });
    });
    router.put('/:id?', function(req, res, next){
        Event.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, event){
            if (err) return next(err);
            res.send(event);
        });
    });
    router.delete('/:id', function(req, res, next){
        Event.findByIdAndRemove(req.params.id, function(err){
            if (err) return next(err);
            res.sendStatus(204);
        });
    });

    // Users
    router.post('/:id/users/:userId', function(req, res, next){
        Event.findById(req.params.id, function(err, event){
            if (err) return next(err);
            if (!event) return res.status(404);

            event.addUsers(req.params.userId, function(err, event){
                if (err) return next(err);
                if (!event) return next(new Error());

                res.status(200).send(event);
            });
        });
    });
    router.delete('/:id/users/:docId', function(req, res, next){
        Event.findById(req.params.id, function(err, event){
            if (err) return next(err);

            event.removeUser(req.params.docId, function(err, event){
                if (err) return next(err);

                res.status(200).send(event);
            });
        });
    });

    // Bands
    router.post('/:id/bands/:userId', function(req, res, next){
        Event.findById(req.params.id, function(err, event){
            if (err) return next(err);

            event.addBands(req.params.userId, function(err, event){
                if (err) return next(err);

                res.status(200).send(event);
            });
        });
    });
    router.delete('/:id/bands/:docId', function(req, res, next){
        Event.findById(req.params.id, function(err, event){
            if (err) return next(err);

            event.removeBand(req.params.docId, function(err, event){
                if (err) return next(err);

                res.status(200).send(event);
            });
        });
    });
};