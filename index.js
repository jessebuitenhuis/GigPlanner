// Set up =================================================
var express     = require('express'),
    app         = express(),
    port        = process.env.PORT || 8080,
    dbFuncs     = require('./helpers/dbfunctions.js');
    error       = require('./config/error.js'),
    bodyParser  = require('body-parser');

// Configuration ==========================================
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
dbFuncs.init();

// Routes =================================================
require('./controllers/users')(app, express);
app.use(error.errorHandler);

// Listen =================================================
app.listen(port);
console.log('Listening to port ' + port);

