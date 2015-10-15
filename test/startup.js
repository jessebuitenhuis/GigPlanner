process.env.NODE_ENV = 'test';

var request     = require('supertest'),
    server      = require('../server'),
    config      = require('../config/config.test'),
    mongoose    = server.mongoose;

before(function(done){
    // Clear database and create admin user
    mongoose.connection.on('open', function(){
        mongoose.connection.db.dropDatabase(function(err, res){
            var adminUser = new mongoose.models.User({
                name: {
                    first: 'Ad',
                    last: 'Min'
                },
                email: 'admin@gigplanner.nl',
                password: 123456
            });

            adminUser.save(function(err, res){

                // Login with adminUser
                request(config.url)
                    .post('/auth/login')
                    .send({username: adminUser.email, password: adminUser.password})
                    .end(function(err, res){
                        config.token = res.headers.authorization;
                        done();
                    });
            });
        });

    });
});