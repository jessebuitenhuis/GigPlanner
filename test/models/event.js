var expect = require('chai').expect,
    Event = require('../../models/event'),
    Band = require('../../models/band'),
    User = require('../../models/user');

describe("Model: Event", function(){

    var user1 = new User({name: {first: 'User1', last: 'Test'}, password: 123456}),
        user2 = new User({name: {first: 'User2', last: 'Test'}, password: 123456}),
        event = new Event({name: 'TestEvent'}),
        band1 = new Band({band: 'Band1', members:[{user: user1._id}]}),
        band2 = new Band({band: 'Band2'});


    before(function(done){
        var promise = [];

        promise.push(band1.save());
        promise.push(band2.save());
        promise.push(user1.save());
        promise.push(user2.save());

        Promise.all(promise).then(function(){
            done();
        });
    });

    before(function(done) {
        event.band = band2._id;
        event.save(done);
    });

    beforeEach(function(done){
        Event.findByIdAndUpdate(event._id, {band: band2._id, users: []}, {new: true}, function(err, res){
            if (err) return done(err);

            event = res;
            done();
        });
    });
    beforeEach(function(done){
        Band.findByIdAndUpdate(band2._id, {members: []}, {new: true}, function(err, res){
            if (err) return done(err);

            band2 = res;
            done();
        });
    });

    after(function(done){
        var promise = [];

        promise.push(event.remove());
        promise.push(band1.remove());
        promise.push(band2.remove());
        promise.push(user1.remove());
        promise.push(user2.remove());

        Promise.all(promise).then(function(){
            done();
        });
    });


    it("should add one user to the event", function(done){
        event.addUsers(user1.id, function(err, event){
            if (err) return done(err);
            expect(event.users).to.have.length(1);
            done();
        });
    });
    it("should add multiple users to the event", function(done){
        event.addUsers([user1.id, user2.id], function(err, event){
            if (err) return done(err);
            expect(event.users).to.have.length(2);
            done();
        });
    });
    it("should not add a duplicate user to the event", function(done){
        event.addUsers(user1.id, function(err, event){
            if (err) return done(err);

            Event.findById(event.id, function(err, event){
                if (err) return done(err);

                event.addUsers(user1.id, function(err, event){
                    expect(err).to.not.equal(null);
                    done();
                });
            });
        });
    });
    it("should add 1 user if 2 users are provided but 1 is already in the event", function(done){
        event.addUsers(user1.id, function(err, event){
            if (err) return done(err);

            Event.findById(event.id, function(err, event){
                if (err) return done(err);

                event.addUsers([user1.id, user2.id], function(err, event){
                    if (err) return done(err);

                    expect(event.users).to.have.length(2);
                    done();
                });
            });
        });
    });
    it("should not add a user if the the user is member of one of the linked bands", function(done){
        Event.findByIdAndUpdate(event._id, {band: band1._id}, {new: true}, function(err, event){
            if (err) return done(err);

            event.addUsers(user1._id, function(err, event){
                expect(err).to.not.equal(null);
                done();
            });
        });
    });

    it("should remove one user from the event", function(done){
        Event.findByIdAndUpdate(event._id, {users: [user1._id]}, {new:true}, function(err, event){
            if (err) return done(err);

            event.removeUser(user1._id, function(err, event){
                if (err) return done(err);

                expect(event.users).to.have.length(0);
                done();
            });
        });
    });


    describe("method: linkedUsers", function(){
        it("should return 2 users linked to event trough band", function(done) {
            Band.findByIdAndUpdate(band2._id, {members: [{user: user1._id}, {user: user2._id}]}, {new: true}, function(err){
                if (err) return done(err);

                event.linkedUsers(function(err, users){
                    if(err) return done(err);

                    expect(users).to.have.length(2);
                    done();
                });
            });
        });

        it("should return 1 user linked to event trough users", function(done) {
            Event.findByIdAndUpdate(event._id, {users: [user1._id]}, {new: true}, function(err, event){
                if (err) return done(err);


                event.linkedUsers(function(err, users){
                    if (err) return done(err);

                    expect(users).to.have.length(1);
                    done();
                });
            });
        });

        it("should return 2 users, 1 linked through band, 1 linked trough users", function(done) {
            Event.findByIdAndUpdate(event._id, {users: [user1._id]}, {new: true}, function(err, event){
                Band.findByIdAndUpdate(band2._id, {members: [{user: user2._id}]}, function(err){
                    if (err) return done(err);

                    event.linkedUsers(function(err, users){
                        if(err) return done(err);

                        expect(users).to.have.length(2);
                        done();
                    });
                });
            });

        });

        it("should not return duplicate users in the linkedUsers list", function(done) {
            Event.findByIdAndUpdate(event._id, {users: [user1._id]}, {new: true}, function(err, event){
                Band.findByIdAndUpdate(band2._id, {members: [{user: user1._id}, {user: user2._id}]}, function(err){
                    if (err) return done(err);


                    event.linkedUsers(function(err, users){
                        if (err) return done(err);

                        expect(users).to.have.length(2);
                        done();
                    });
                });
            });

        });
    });

    describe("method: getAttendees", function(){
        it("should return 2 attendees", function(done){
            Band.findByIdAndUpdate(band2._id, {members: [{user: user1._id}, {user: user2._id}]}, function(err) {
                if (err) return done(err);

                event.getAttendees(function (err, attendees) {
                    if(err) return done(err);

                    expect(attendees).to.have.length(2);
                    done();
                });
            });
        });
    });

});