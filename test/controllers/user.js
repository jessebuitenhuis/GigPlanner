/* global users, auth */
var config      = require('../../config/config.test'),
    expect      = require('chai').expect,
    request     = new require('supertest')(config.url + '/api/user');

describe('Controller: User', function(){
    // GET
    it("should return a list of users (GET /)", function(done){
        request.get('/')
            .set(auth)
            .expect(200, function(err, res){
                if (err) done(err);
                expect(res.body).to.have.length(1);
                done();
            });
    });
    it('should return a single user (GET /:id)', function(done){
        request.get('/' + users.admin.id)
            .set(auth)
            .expect(200, function(err, res){
                if (err) return done(err);
                expect(res.body._id).to.equal(users.admin._id);
                done();
            });
    });

    // POST
    it('should save a new user (POST /)', function(done){
        request.post('/')
            .set(auth)
            .send(users.henk)
            .expect(200, function(err, res){
                expect(res.body.email).to.equal(users.henk.email);
                done();
            });
    });

    // PUT
    describe('should update a user and return the new one', function(){
        beforeEach(function(){
            users.admin.name.first = 'Bert';
        });
        var expectation = function(done){
            return function(err, res){
                expect(res.body.name.first).to.equal('Bert');
                done();
            };
        };
        it('when called without an ID (PUT /)', function(done){
            request.put('/')
                .set(auth)
                .send(users.admin)
                .expect(200, expectation(done))
        });
        it('when called with an ID (PUT /:id)', function(done){
            request.put('/' + users.admin._id)
                .set(auth)
                .send(users.admin)
                .expect(200, expectation(done))
        });
    });

    // DELETE
    it('should delete a user', function(done){
        // make sure there is a user
        request.post('/')
            .set(auth)
            .send(users.henk)
            .expect(200, function(err, res){
                if (err) done(err);

                var userId = res.body._id;

                // delete the created user
                request.delete('/' + userId)
                    .set(auth)
                    .expect(204, function(err, res){
                        if (err) done(err);

                        // verify user does not exist in database
                        request.get('/' + userId)
                            .set(auth)
                            .expect(404, done);
                    });
            });
    });
});