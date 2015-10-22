var expect = require('chai').expect;
var User = require('../../models/user'),
    Event = require('../../models/event'),
    Band = require('../../models/band'),
    db = require('../db');

describe("Model: User", function(){
    describe("virtual name.full", function(){
        it("should return a one part name without spaces", function(){
            var user = new User({name:{first:'John'}});
            expect(user.name.full).to.equal('John');
        });
        it("should return a two part name with one space", function(){
            var user = new User({name:{first:'John', last: 'Doe'}});
            expect(user.name.full).to.equal('John Doe');
        });
        it("should return a three part name with two spaces", function(){
            var user = new User({name:{first:'John', middle: 'the', last: 'Doe'}});
            expect(user.name.full).to.equal('John the Doe');
        });
    });
    describe("findLinked", function(done){

        var event1 = new Event(db.events.event1),
            user1 = new User(db.users.henk),
            user2 = new User(db.users.chris),
            band1 = new Band(db.bands.coldplay);

        before(function(){
            var promises = [];

            promises.push(event1.save());
            promises.push(user1.save());
            promises.push(user2.save());
            promises.push(band1.save());

            Promise.all(promises).then(function(){
                done();
            });
        });

        beforeEach(function(done){
            var promises = [];

            promises.push(Event.findByIdAndUpdate(event1._id, {users: [], bands: []}));
            promises.push(Band.findByIdAndUpdate(band1._id, {users: []}));

            Promise.all(promises).then(function(){
                done();
            });
        });

        after(function(){
            var promises = [];

            promises.push(Event.findByIdAndRemove(event1._id));
            promises.push(User.findByIdAndRemove(user1._id));
            promises.push(User.findByIdAndRemove(user2._id));
            promises.push(Band.findByIdAndRemove(band1._id));

            Promise.all(promises).then(function(){
                done();
            });
        });

        it("should add a selected field to the user to indicate link to document", function(done){
            event1.users.push({user: user1._id});
            event1.bands.push({band: band1._id});
            band1.members.push({user: user2._id});

            band1.save(function(err, user){
                if (err) return done(err);

                event1.save(function(err, user){
                    if (err) return done(err);

                    User.findLinkedToEvent(event1._id, function(err, users) {
                        if (err) return done(err);

                        expect(users).to.have.length(3);
                        expect(users[0].selected).to.equal(false);
                        expect(users[1].selected).to.equal(true);
                        expect(users[2].selected).to.equal(true);

                        done();
                    });
                });
            });


        });
    });
});