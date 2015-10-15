process.env.NODE_ENV    = process.env.NODE_ENV || 'dev';

var express         = require('express'),
    passport        = require('passport'),
    mongoose        = require('mongoose'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    config          = require('./config/config.' + process.env.NODE_ENV);

// Database connection ====================================
mongoose.connect(config.db);

// Setup server ===========================================
app = express();

// Configuration ==========================================
app.use(bodyParser.json());
app.use(cookieParser());

// Authentication =========================================
require('./config/passport')(passport);
app.use(passport.initialize());

// Routes =================================================
app.use(express.static(__dirname + '/public'));
require('./controllers')(app, express, passport);

// Start server ===========================================
app.listen(config.port);
console.log('Listening to port ' + config.port);

// Expose server for tests ================================
module.exports = {
    app: app,
    mongoose: mongoose,
    express: express
};



