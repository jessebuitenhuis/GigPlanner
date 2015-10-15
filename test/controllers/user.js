var config      = require('../../config/config.test'),
    request     = require('supertest');





describe('Controller: User', function(){
    var route = '/api/user';

    it('should return a list of users (GET /)', function(done){
        request(config.url)
            .get(route)
            .set('Authorization', config.token)
            .expect(200, done);
        //, function(err, res){
        //        if (err) done(err);
        //
        //        console.log(err,res.body);
        //        done();
        //    });

    });
    xit('should return a single user (GET /:id)', function(done){

    });
    xit('should save a new user (POST /)', function(done){
        //var newUser = {
        //    name: {
        //        first: 'Henk',
        //        middle: 'De',
        //        last: 'Boer'
        //    }
        //};
        //request(url)
        //    .post(route)
        //    .set('Authorization', token)
        //    .send(newUser)
        //    .expect(200, done);
    });
    xit('should update a user and return the new one (PUT /)', function(done){

    });
    xit('should update a user and return the new one if called with an ID (PUT /:id)', function(done){

    });
    xit('should delete a user', function(done){

    });



});