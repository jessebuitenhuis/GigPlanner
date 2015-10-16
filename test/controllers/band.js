/* global auth */
var config      = require('../../config/config.test'),
    expect      = require('chai').expect,
    request     = new require('supertest')(config.url + '/api/band'),
    User        = new require('../../models/user'),
    Band        = require('../../models/band'),
    db          = require('../db');

describe('Controller: Band', function(){

    var coldplay = new Band(db.bands.coldplay),
        chris = new User(db.users.chris),
        jonny = new User(db.users.jonny),
        guy = new User(db.users.guy),
        will = new User(db.users.will),
        bandMembers = [chris, jonny, guy, will];

    before(function(done){
        // Create test data
        User.create(bandMembers, function(err){
            if (err) return done(err);

            coldplay.members = [{
                user: chris,
                roles: ['singer', 'pianoplayer']
            },{
                user: jonny,
                roles: ['guitarist']
            },{
                user: guy,
                roles: ['bassplayer']
            },{
                user: will,
                roles: ['drummer']
            }];

            coldplay.save(function(err, res){
                if (err) return done(err);
                db.bands.coldplay = res;

                done();
            });
        });
    });

    after(function(done){
        // Cleanup
        var promise = [];

        bandMembers.forEach(function(user){
            promise.push(User.findById(user._id).remove());
        });

        Promise.all(promise).then(function(){
            done();
        });
    });

    // GET
    it("should return a list of bands (GET /)", function(done){
        request.get('/')
            .set(auth)
            .expect(200, function(err, res){
                if (err) done(err);
                expect(res.body).to.have.length(1);
                done();
            });
    });
    it('should return a single band (GET /:id)', function(done){
        request.get('/' + coldplay._id)
            .set(auth)
            .expect(200, function(err, res){
                if (err) return done(err);
                expect(res.body._id).to.equal(coldplay._id.toString());
                done();
            });
    });

    // POST
    it('should save a new band (POST /)', function(done){
        request.post('/')
            .set(auth)
            .send(db.bands.radiohead)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                db.bands.radiohead = res.body;
                expect(res.body.name).to.equal(db.bands.radiohead.name);
                done();
            });
    });

    // PUT
    describe('should update a band and return the new one', function(){
        var origName = db.bands.coldplay.name;
        before(function(){
            db.bands.coldplay.name = 'Colderplay';
        });
        after(function(done){
            Band.findByIdAndUpdate(coldplay._id, {name: origName}, {new: true}, function(err, res){
                db.bands.coldplay = res;
                done();
            });
        });
        var expectation = function(done){
            return function(err, res){
                if (err) return done(err);
                expect(res.body.name).to.equal('Colderplay');
                done();
            };
        };
        it('when called without an ID (PUT /)', function(done){
            request.put('/')
                .set(auth)
                .send(db.bands.coldplay)
                .expect(200, expectation(done));
        });
        it('when called with an ID (PUT /:id)', function(done){
            request.put('/' + db.bands.coldplay._id)
                .set(auth)
                .send(db.bands.coldplay)
                .expect(200, expectation(done));
        });
    });

    // DELETE
    it('should delete a band', function(done){
        var crappyBand = new Band({name: 'The Crappy Amateurs'});

        crappyBand.save(function(err, res){
            if (err) return done(err);

            request.delete('/' + crappyBand._id)
                .set(auth)
                .expect(204, function(err, res){
                    if (err) return done(err);

                    // verify band does not exist in database
                    request.get('/' + crappyBand._id)
                        .set(auth)
                        .expect(404, done);
                });
        });
    });
});