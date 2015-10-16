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
            band.addMembers(member1);
            expect(band.members).to.have.length(1);
            done();
        });
        it("should add multiple members to a band", function(done){
            band.addMembers([member1, member2]);
            expect(band.members).to.have.length(2);
            done();
        });
    });
    describe('removeMember', function(){
        it("should remove one member from a band", function(done){
            band.members = [{user: member1}, {user: member2}];
            band.removeMember(member1._id, function(err){
                if (err) return done(err);


                expect(band.members).to.have.length(1);
                done();
            });

        });
    });
});