var Band = require('../models/band'),
    Event = require('../models/event'),
    _ = require('underscore');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/bands', router);

    /**
     * Gets a list of bands
     * @returns {Array} bands
     */
    router.get('/', function(req, res, next) {
        Band.find({})
            .populate('members.user')
            .exec(function (err, bands) {
            if (err) return next(err);
            res.send(bands);
        });
    });

    /**
     * Get a single band
     * @param {int} id - BandId
     * @returns {Object} band
     */
    router.get('/:id', function(req, res, next){
        Band.findById(req.params.id)
            .populate('members.user')
            .exec(function (err, band) {
            if (err) return next(err);
            if (!band) return res.sendStatus(404);

            res.send(band);
        });
    });

    /**
     * Create a new band
     * @returns {Object} band
     */
    router.post('/', function(req, res, next){
        var newBand = new Band(req.body);
        newBand.save(function(err, band){
            if (err) return next(err);
            res.send(band);
        });
    });

    /**
     * Update a band
     * @param {int} [id] - BandId, can also be included in object
     * @returns {object} band
     */
    router.put('/:id?', function(req, res, next){
        var data = _.omit(req.body, '_id');
        Band.findByIdAndUpdate(req.body._id, data, {new: true}, function(err, band){
            if (err) return next(err);
            if (!band) return next(null, false);

            Band.populate(band, {path:"members.user"}, function(err, band){
                res.send(band);
            });


        });
    });

    /**
     * Delete a band
     * @param {int} id - BandId
     */
    router.delete('/:id', function(req, res, next){
        Band.findByIdAndRemove(req.params.id, function(err){
            if (err) return next(err);
            res.sendStatus(204);
        });
    });

    /**
     * Gets all bandmembers
     * @param {int} id - BandId
     * @returns {Array} BandMembers
     */
    router.get('/:id/members', function(req, res, next){
        Band.findById(req.params.id, function(err, band){
            if (err) return next(err);
            if (!band) return res.sendStatus(404);
            res.status(200);
            res.send(band.members);
        });
    });

    /**
     * Adds a member to this band
     * @param {int} id - BandId
     * @param {int} [userId] - UserId
     * @param {Array} [userIds] - An array of users to add (in request body)
     * @returns {Object} band
     */
    router.post('/:id/members/:userId?', function(req, res, next){
        var newMembers;

        if (req.params.userId){
            newMembers = req.params.userId;
        } else {
            if(!Array.isArray(req.body) || req.body.length == 0) return res.sendStatus(400);
            newMembers = req.body;
        }

        Band.findById(req.params.id, function(err, band){
            if (err) return next(err);
            if (!band) return res.sendStatus(404);

            band.addMembers(newMembers, function(err, band){
                if (err) return next(err);

                res.status(200).send(band);
            });
        });
    });

    /**
     * Removes a member from this band
     * @param {int} id - bandId
     * @param {int} memberId - userId
     * @returns {Object} band
     */
    router.delete('/:id/members/:memberId', function(req, res, next){
        Band.findById(req.params.id, function(err, band){
            if (err) return next(err);
            if (!band) return res.sendStatus(404);

            band.removeMember(req.params.memberId, function(err, band){
                if (err) return next(err);

                res.status(200).send(band);
            });
        });
    });
};