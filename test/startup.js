process.env.NODE_ENV = 'test';

var request     = require('supertest'),
    server      = require('../server'),
    config      = require('../config/config.test'),
    User        = require('../models/user'),
    mongoose    = server.mongoose,
    db          = require('./db');

// Global Test Vars
users   = db.users;
auth    = {'Authorization': null};

before(function(done){
    // Clear database and create admin user
    mongoose.connection.on('open', function(){
        mongoose.connection.db.dropDatabase(function(err, res){

            var newUser = new User(users.admin);

            // Create admin user
            newUser.save(function(err, res){
                // Login with admin user
                request(config.url)
                    .post('/auth/login')
                    .send({username: users.admin.email, password: users.admin.password})
                    .end(function(err, res){
                        // Save user in global test users
                        users.admin = res.body;

                        // Save token for authorization
                        global.auth.Authorization = res.headers.authorization;
                        done();
                    });
            });
        });

    });
});