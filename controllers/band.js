var Band = require('../models/band.js');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/bands', router);

    router.get('/', function(req, res, next) {
        Band.find({}, function (err, bands) {
            if (err) return next(err);
            res.send(bands);
        });
    });
    router.get('/:id', function(req, res, next){
        Band.findById(req.params.id, function (err, band) {
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
        Band.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, band){
            if (err) return next(err);
            if (!band) return next(null, false);

            res.send(band);
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
        Band.findById(req.params.id, function(err, band){
            if (err) return next(err);

            if (!band) res.sendStatus(404);

            if (req.params.userId) {
                band.addMembers(req.params.userId);
            } else {
                if (!Array.isArray(req.body)) return res.sendStatus(400);
                band.addMembers(req.body);
            }

            band.save(function(err, band){
                if (err) next(err);

                res.status(200);
                res.send(band.members);
            });

        });
    });

    router.delete('/:id/members/:userId', function(req, res, next){
        Band.findById(req.params.id, function(err, band){
            if (err) return next(err);
            if (!band) return res.sendStatus(404);

            band.removeMember(req.params.userId, function(err){
                if (err) return res.sendStatus(404);

                band.save(function(err, band){
                    if (err) return next(err);

                    res.sendStatus(204);
                });
            });
        });
    });
};