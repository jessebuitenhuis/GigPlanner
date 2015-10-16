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
        Event.findById(req.params.id, function (err, event) {
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
            res.sendStatus(200);
        });
    });
};