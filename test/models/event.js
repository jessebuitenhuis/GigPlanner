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

        promise.push(event.save());
        promise.push(band1.save());
        promise.push(band2.save());
        promise.push(user1.save());
        promise.push(user2.save());

        Promise.all(promise).then(function(){
            done();
        });
    });

    beforeEach(function(done){
        Event.findByIdAndUpdate(event._id, {users: [], bands:[]}, {new: true}, function(err, res){
            if (err) return done(err);

            event = res;
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


    it("should add one band to the event", function(done){
        event.addBands(band1.id, function(err, event){
            if (err) return done(err);
            expect(event.bands).to.have.length(1);
            done();
        });
    });
    it("should add multiple bands to the event", function(done){
        event.addBands([band1.id, band2.id], function(err, event){
            if (err) return done(err);
            expect(event.bands).to.have.length(2);
            done();
        });
    });
    it("should not add a duplicate band to the event", function(done){
        event.addBands(band1.id, function(err, event){
            if (err) return done(err);

            Event.findById(event.id, function(err, event){
                if (err) return done(err);

                event.addBands(band1.id, function(err, event){
                    expect(err).to.not.equal(null);
                    done();
                });
            });
        });
    });
    it("should add 1 band if 2 bands are provided but 1 is already in the event", function(done){
        event.addBands(band1.id, function(err, event){
            if (err) return done(err);

            Event.findById(event._id, function(err, event){
                if (err) return done(err);

                event.addBands([band1.id, band2.id], function(err, event){
                    if (err) return done(err);

                    expect(event.bands).to.have.length(2);
                    done();
                });
            });
        });
    });
    //it("should remove a user who is linked to the event, and is a member of the provided band", function(){
    //
    //});

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
        event.addBands(band1._id, function(err, event){
            if (err) return done(err);

            Event.findById(event._id, function(err, event){
                if (err) return done(err);

                event.addUsers(user1._id, function(err, event){
                    expect(err).to.not.equal(null);
                    done();
                });
            });
        })
    });

    it("should remove one band from the event", function(done){
        event.addBands(band1._id, function(err, event){
            if (err) return done(err);

            var docId = event.bands[0].id;

            Event.findById(event._id, function(err, event){
                if (err) return done(err);

                event.removeBand(docId, function(err, event){
                    if (err) return done(err);

                    expect(event.bands).to.have.length(0);
                    done();
                });
            });
        });
    });
    it("should remove one user from the event", function(done){
        event.addUsers(user1.id, function(err, event){
            if (err) return done(err);

            var docId = event.users[0].id;

            Event.findById(event.id, function(err, event){
                if (err) return done(err);

                event.removeUser(docId, function(err, event){
                    if (err) return done(err);

                    expect(event.users).to.have.length(0);
                    done();
                });
            });
        });
    });
});