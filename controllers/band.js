var Band = require('../models/band.js'),
    _ = require('underscore');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/bands', router);

    router.get('/', function(req, res, next) {
        Band.find({})
            .populate('members.user')
            .exec(function (err, bands) {
            if (err) return next(err);
            res.send(bands);
        });
    });
    router.get('/:id', function(req, res, next){
        Band.findById(req.params.id)
            .populate('members.user')
            .exec(function (err, band) {
            if (err) return next(err);
            if (!band) return res.sendStatus(404);

            res.send(band);
        });
    });
    router.post('/', function(req, res, next){
        var newBand = new Band(req.body);
        newBand.save(function(err, band){
            if (err) return next(err);
            res.send(band);
        });
    });
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
    router.delete('/:id', function(req, res, next){
        Band.findByIdAndRemove(req.params.id, function(err){
            if (err) return next(err);
            res.sendStatus(204);
        });
    });

    // Bandmembers
    router.get('/:id/members', function(req, res, next){
        Band.findById(req.params.id, function(err, band){
            if (err) return next(err);
            if (!band) return res.sendStatus(404);
            res.status(200);
            res.send(band.members);
        });
    });

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