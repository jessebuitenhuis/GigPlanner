var Band = require('../models/band.js');

module.exports = function(app, express) {

    var router = express.Router();
    app.use('/api/band', router);

    router.get('/', function(req, res, next) {
        Band.find({}, function (err, bands) {
            if (err) return next(err);
            res.send(bands);
        });
    });
    router.get('/:id', function(req, res, next){
        Band.findById(req.params.id, function (err, band) {
            if (err) return next(err);
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
            res.send(band);
        });
    });
    router.delete('/:id', function(req, res, next){
        Band.findByIdAndRemove(req.params.id, function(err){
            if (err) return next(err);
            res.sendStatus(200);
        });
    });
};