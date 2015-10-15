var token   = require('../config/token'),
    User    = require('../models/user');

module.exports = function(app, express, passport) {

    var router = express.Router();
    app.use('/auth', router);

    // Get info
    router.get('/currentUser', passport.authenticate('jwt', {session: false}), function(req, res, next){
        res.status(200);
        res.send(req.user);
    });

    // Local
    router.post('/login', passport.authenticate('local', {session: false}), token.send, function(req, res, next){
        res.status(200);
        res.send(req.user);
    });

    router.post('/signup', passport.authenticate('local-signup', {session:false}), token.send, function(req, res, next){
        res.status(200);
        res.send(req.user);
    });

    // Facebook
    router.get('/facebook', passport.authenticate('facebook', {scope: ['email', 'public_profile']}));

    router.get('/facebook/callback', passport.authenticate('facebook', {session: false}), token.send, function(req,res,next){
        res.redirect('/#/?auth_token=' + res._headers.authorization);
    });
};