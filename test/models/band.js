var expect = require('chai').expect;
var Band = require('../../models/band');
var User = require('../../models/user');

describe("Model: Band", function(){

    var band,
        member1,
        member2;

    beforeEach(function(){
        member1 = new User({name: {first: 'First', last: 'Member'}});
        member2 = new User({name: {first: 'Second', last: 'Member'}});
        band = new Band({name: 'TestBand'});
    });

    describe('addMember', function(){
        it("should add one member to a band", function(done){
            band.addMembers(member1._id);
            expect(band.members).to.have.length(1);
            done();
        });
        it("should add multiple members to a band", function(done){
            band.addMembers([member1._id, member2._id]);
            expect(band.members).to.have.length(2);
            done();
        });
        it("should not add a duplicate member to a band", function(done){
            // Convert from ObjectID to simulate API behaviour
            var member1Id = member1._id.toString();

            band.addMembers(member1Id, function(err, band){
                if (err) return done(err);

                Band.findById(band._id, function(err, band){
                    band.addMembers(member1Id, function(err, band){
                        expect(err).to.not.equal(null);
                        done();
                    });
                });
            });
        });
        it("should add 1 member if 2 members are provided and 1 is unique and 1 is duplicate", function(done){
            band.addMembers(member1._id, function(err, band){

                Band.findById(band._id, function(err, band){
                    if (err) return done(err);

                    band.addMembers([member1._id, member2._id], function(err, band){
                        if (err) return done(err);

                        expect(band.members).to.have.length(2);
                        done();
                    });
                });
            });
        });
    });
    describe('removeMember', function(){
        it("should remove one member from a band", function(done){

            band.members = [{user: member1}, {user: member2}];
            band.removeMember(band.members[0].id, function(err){
                if (err) return done(err);

                expect(band.members).to.have.length(1);
                done();
            });

        });
    });
});