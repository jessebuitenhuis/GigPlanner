var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _   = require('underscore');

var bandSchema = new Schema({
    name: String,
    members: [{
        roles: [String],
        user: { type: Schema.Types.ObjectId, ref:'User' }
    }]
});

bandSchema.methods.addMembers = function(members) {
    if (!Array.isArray(members)) members = [members];

    members = members.map(function(member){
        return {
            roles: [],
            user: member
        };
    });

    this.members.push.apply(this.members, members);
};
bandSchema.methods.removeMember = function(userId, done){
    var index = _.findIndex(this.members, function(member){
        return member.user == userId;
    });
    if (index == -1) return done(new Error('Bandmember not found.'));
    this.members.splice(index, 1);
    done();
};

var Band = mongoose.model('Band', bandSchema);
module.exports = Band;