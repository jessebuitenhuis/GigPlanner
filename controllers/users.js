var User = require('../models/user.js');

module.exports = function(app, express) {

    var router = express.Router();

    app.use('/api/user', router);

    // USERS
    router.get('/', function(req, res, next){
        User.get(function(error, body){
            if (error) return next(error);
            res.send(body);
        });
    });
    router.get('/:id', function(req, res, next){
        User.find(req.params.id, function(error, body){
            if (error) return next(error);
            res.send(body);
        });
    });
    router.post('/', function(req, res, next){
        User.create(req.body, function(error, body){
            if (error) return next(error);
            res.send(body);
        });
    });
    router.put('/:id', function(req, res, next){
        User.update(req.body, function(error, body){
            if (error) return next(error);
            res.send(body);
        });
    });
    router.delete('/:id', function(req, res, next){
        User.remove(req.params.id, function(error,body){
            if(error) return next(error);
            res.sendStatus(200);
        });
    });
};