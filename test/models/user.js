var expect = require('chai').expect;
var User = require('../../models/user');

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
});