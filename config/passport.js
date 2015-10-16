var JwtStrategy     = require('passport-jwt').Strategy,
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy= require('passport-facebook').Strategy,
    User            = new require('../models/user'),
    tokenConfig     = require('./token.js');

module.exports = function(passport) {
    // Local Login
    passport.use(new LocalStrategy(function(username, password, next){
        User.findOne({'email':username}, "+password", function(err, user) {
            if(err) return next(err);

            if (!user)
                return next(null, false, { message: 'Incorrect username'});

            if (!user.validatePassword(password))
                return next(null, false, { message: 'Invalid password'});

            return next(null, user);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, function(req, email, password, done){
        process.nextTick(function(){

            User.findOne({'email':email}, function(err, user){
                if (err) return done(err);
                if (user) return done(new Error('Email already taken.'));

                var newUser = new User(req.body);
                newUser.saveAndFind(done);
            });

        });
    }));

    // Facebook Login
    passport.use(new FacebookStrategy({
        clientID: '473148759534068',
        clientSecret: '82f94f0ffb3ec34fb006235fc1d77856',
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileFields: ['name', 'displayName', 'email', 'photos']
    }, function(accessToken, refreshToken, profile, done){
        // Find user by facebook id
        User.findOneAndUpdate({'facebook.id': profile.id}, {'facebook':profile}, function(err, user){
            if (err) return done(err);
            if (user) return done(null, user);

            var newUser = new User({
                name: {
                    first: profile.name.givenName,
                    middle: profile.name.middleName,
                    last: profile.name.familyName
                },
                email: profile.emails && profile.emails[0] && profile.emails[0].value,
                facebook: profile,
                avatar: profile.photos && profile.photos[0] && profile.photos[0].value
            });

            newUser.saveAndFind(done);
        });
    }));

    // Validate token
    passport.use(new JwtStrategy({
        secretOrKey: tokenConfig.secret
    }, function(payload, done){
        User.findById(payload.sub, function(err, user) {
            if (err) done(err);
            if (!user) done(null, false);
            done(null, user);
        });
    }));


};