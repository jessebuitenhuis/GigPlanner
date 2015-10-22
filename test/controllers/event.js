var config      = require('../../config/config.test'),
    expect      = require('chai').expect,
    Event       = require('../../models/event'),
    User        = require('../../models/user'),
    Band        = require('../../models/band'),
    request     = new require('supertest')(config.url + '/api/events'),
    db          = require('../db');

describe("Controller: Event", function(){

    var event1 = new Event(db.events.event1),
        event2 = new Event(db.events.event2),
        henk = new User(db.users.henk),
        band1 = new Band(db.bands.coldplay);

    before(function(done){
        var promises = [];

        promises.push(Event.create([event1, event2]));
        promises.push(henk.save());

        Promise.all(promises).then(function(){
            done();
        });
    });

    beforeEach(function(done){
        Event.findByIdAndUpdate(event1._id, {users: [], bands:[]}, done);
    });

    after(function(done){
        var promises = [];

        promises.push(Event.findByIdAndRemove(event1._id));
        promises.push(Event.findByIdAndRemove(event2._id));
        promises.push(User.findByIdAndRemove(henk._id));

        Promise.all(promises).then(function(){
            done();
        });
    });

    // GET
    it("should return a list of events (GET /)", function(done){
        request.get('/')
            .set(auth)
            .expect(200, function(err, res){
                if (err) done(err);
                expect(res.body).to.have.length(2);
                done();
            });
    });
    it('should return a single event (GET /:id)', function(done){
        request.get('/' + event1._id)
            .set(auth)
            .expect(200, function(err, res){
                if (err) return done(err);
                expect(res.body._id).to.equal(event1.id);
                done();
            });
    });

    // POST
    it('should save a new event and return the event (POST /)', function(done){
        request.post('/')
            .set(auth)
            .send(db.events.event3)
            .expect(200, function(err, res){
                expect(res.body.name).to.equal(db.events.event3.name);
                done();
            });
    });

    // DELETE
    it('should delete an existing event', function(done){
        request.delete('/' + event2._id)
            .set(auth)
            .expect(204, function(err, res){
                if (err) return done(err);

                // verify event is deleted
                Event.findById(event2._id, function(err, res){
                    if (err) return done(err);

                    expect(res).to.equal(null);
                    done();
                })
            });
    });

    // USERS
    it("should add a user to an event", function(done){
        request.put('/' + event1._id + '/users')
            .set(auth)
            .send(henk)
            .expect(200, function(err, res){
                if (err) return done(err);

                Event.findById(event1._id, function(err, event){
                    if (err) return done(err);

                    expect(event.users[0].user.toString()).to.equal(henk._id.toString());
                    done();
                });
            });
    });
    it("should remove a user from an event", function(done) {
        Event.findByIdAndUpdate(event1._id, {users: [ { user: henk._id }]}, {new:true}, function (err, event) {
            if (err) return done(err);

            request.delete('/' + event1._id + '/users/' + event.users[0]._id)
                .set(auth)
                .expect(200, function (err, res) {
                    if (err) return done(err);

                    Event.findById(event1._id, function (err, event) {
                        if (err) return done(err);

                        expect(event.users).to.have.length(0);
                        done();
                    });
                });
        });
    });

    // Bands
    it("should add a band to an event", function(done){
        request.put('/' + event1._id + '/bands')
            .set(auth)
            .send(band1)
            .expect(200, function(err, res){
                if (err) return done(err);

                Event.findById(event1._id, function(err, event){
                    if (err) return done(err);

                    expect(event.bands[0].band.toString()).to.equal(band1._id.toString());
                    done();
                });
            });
    });
    it("should remove a band from an event", function(done){
        Event.findByIdAndUpdate(event1._id, {bands: [ { band: band1._id }]}, {new:true}, function (err, event) {
            if (err) return done(err);

            request.delete('/' + event1._id + '/bands/' + event.bands[0]._id)
                .set(auth)
                .expect(200, function (err, res) {
                    if (err) return done(err);

                    Event.findById(event1._id, function (err, event) {
                        if (err) return done(err);

                        expect(event.bands).to.have.length(0);
                        done();
                    });
                });
        });
    });
});
