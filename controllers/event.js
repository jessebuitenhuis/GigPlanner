var Event = require('../models/event.js');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/events', router);

    /**
     * Returns a list of events
     * @param {int} [band] - only return events for specified band
     */
    router.get('/', function(req, res, next) {
        var query = {};
        if (req.query.band) query = {band: req.query.band};

        Event.find(query)
            .exec(function (err, events) {
            if (err) return next(err);

            res.send(events);
        });
    });

    /**
     * Returns a single event
     * @param {int} id - EventId
     */
    router.get('/:id', function(req, res, next){
        Event.findById(req.params.id)
            .populate('users band')
            .exec(function (err, event) {
                if (err) return next(err);

                res.send(event);
        });
    });

    /**
     * Creates a new event
     */
    router.post('/', function(req, res, next){
        var newEvent = new Event(req.body);
        newEvent.save(function(err, event){
            if (err) return next(err);

            Event.populate(event, 'users band', function(err){
                if (err) return next(err);
                res.send(event);
            });
        });
    });

    /**
     * Updates an event
     * @param {int} [id] - Event Id
     */
    router.put('/:id?', function(req, res, next){
        Event.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, event){
            if (err) return next(err);
            res.send(event);
        });
    });

    /**
     * Deletes an event
     * @param {int} id - Event Id
     */
    router.delete('/:id', function(req, res, next){
        Event.findByIdAndRemove(req.params.id, function(err){
            if (err) return next(err);
            res.sendStatus(204);
        });
    });

    /**
     * Adds user to an event
     * @param {int} id - Event Id
     * @param {int} userId - User Id
     */
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

    /**
     * Removes an user from an event
     * @param {int} id - Event id
     * @param {int} userId - User id
     */
    router.delete('/:id/users/:userId', function(req, res, next){
        Event.findById(req.params.id, function(err, event){
            if (err) return next(err);

            event.removeUser(req.params.userId, function(err, event){
                if (err) return next(err);

                res.status(200).send(event);
            });
        });
    });
};