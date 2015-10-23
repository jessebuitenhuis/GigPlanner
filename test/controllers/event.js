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
        band1 = new Band(db.bands.coldplay),
        band2 = new Band(db.bands.radiohead);

    before(function(done){
        var promises = [];

        promises.push(event1.save());
        promises.push(event2.save());
        promises.push(henk.save());
        promises.push(band1.save());
        promises.push(band2.save());

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
        promises.push(Band.findByIdAndRemove(band1._id));
        promises.push(Band.findByIdAndRemove(band2._id));

        Promise.all(promises).then(function(){
            done();
        });
    });

    function addUserAndBandToEvent() {
        return Event.findByIdAndUpdate(event1._id, {
            users: [henk._id],
            band: band1._id
        });
    }

    function expectPopulatedEvent(res) {
        expect(res.body.users[0].name.first).to.equal(henk.name.first);
        expect(res.body.band.name).to.equal(band1.name);
    }

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
    it('should return a single event with populated bands and users (GET /:id)', function(done){
        addUserAndBandToEvent().then(function(err, event) {
            request.get('/' + event1._id)
                .set(auth)
                .expect(200, function (err, res) {
                    if (err) return done(err);
                    expect(res.body._id).to.equal(event1.id);
                    expectPopulatedEvent(res);
                    done();
                });
        });
    });

    // POST
    it('should save a new event and return the event with populated bands and users (POST /)', function(done){
        db.events.event3.users = [henk._id];
        db.events.event3.band = band1._id;

        request.post('/')
            .set(auth)
            .send(db.events.event3)
            .expect(200, function(err, res){
                expect(res.body.name).to.equal(db.events.event3.name);
                expectPopulatedEvent(res);
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
    it("should add a user to an event and return the event populated with users and bands", function(done){
        event1.update({band: band1._id}, function(err, res){
            request.post('/' + event1._id + '/users/' + henk._id)
                .set(auth)
                .expect(200, function(err, res){
                    if (err) return done(err);

                    expectPopulatedEvent(res);
                    expect(res.body.users[0]._id.toString()).to.equal(henk._id.toString());
                    done();
                });
        });
    });
    it("should remove a user from an event and return the event", function(done) {
        Event.findByIdAndUpdate(event1._id, {users: [henk._id], band: band1._id}, {new:true}, function (err, event) {
            if (err) return done(err);


            request.delete('/' + event1._id + '/users/' + event.users[0])
                .set(auth)
                .expect(200, function (err, res) {
                    if (err) return done(err);

                    expect(res.body.users).to.have.length(0);

                    done();
                });
        });
    });
});
