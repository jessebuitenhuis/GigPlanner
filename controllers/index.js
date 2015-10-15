var token = require('../config/token'),
    error = require('../config/error');

module.exports = function(app, express, passport) {

    // Authorization Routes
    require('./auth')(app, express, passport);

    // API
    app.use('/api', passport.authenticate('jwt', {session: false}), token.send);
    require('./band')(app, express);
    require('./event')(app, express);
    require('./user')(app, express);

    // Errors
    app.use(error.errorHandler);

};