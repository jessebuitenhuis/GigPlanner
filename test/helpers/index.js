var expect = require('chai').expect,
    helpers = require('../../helpers');

describe("Helpers: Index", function(){
    describe("uniqueItems", function(){

        var existingItems = [{item: 1}, {item: 2}];

        it("should throw an error if newItems is not an array", function(done){
            var fn = function() {
                helpers.uniqueItems('notAnArray', [], 'item');
            };
            expect(fn).to.throw(Error);
            done();
        });
        it("should return an empty array if 2 item exist and 2 non-unique items are added", function(done){
            var itemsToAdd = helpers.uniqueItems([1,2], existingItems, 'item');
            expect(itemsToAdd).to.have.length(0);
            done();
        });
        it("should return 1 item if 2 items exists and 1 unique items and 1 non-unique item are added", function(done){
            var itemsToAdd = helpers.uniqueItems([1,3], existingItems, 'item');
            expect(itemsToAdd).to.have.length(1);
            done();
        });
        it("should return 2 items if 2 item exists and 2 unique items are added", function(done){
            var itemsToAdd = helpers.uniqueItems([3,4], existingItems, 'item');
            expect(itemsToAdd).to.have.length(2);
            done();
        });
        it("should return 2 items if 2 non-unique items are added", function(done){
            var itemsToAdd = helpers.uniqueItems([1,2], [], 'item');
            expect(itemsToAdd).to.have.length(2);
            done();
        });
    });
});
