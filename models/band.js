var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _   = require('underscore');

var bandSchema = new Schema({
    name: String,
    members: [{
        roles: [String],
        user: { type: Schema.Types.ObjectId, ref:'User', required: true}
    }]
});

bandSchema.methods.addMembers = function(members, done) {
    if (!Array.isArray(members)) members = [members];

    var existingMembers = _.pluck(this.members, 'user');
    existingMembers = existingMembers.map(String);
    members = members.map(String);

    var membersToAdd = _.difference(members, existingMembers);

    if (!membersToAdd.length) return done(new Error('All users provided are already linked to this band.'));

    membersToAdd = membersToAdd.map(function(member){
        return {
            roles: [],
            user: member
        };
    });

    this.members.push.apply(this.members, membersToAdd);
    this.save(function(err, band){
        Band.populate(band, 'members.user', done);
    });
};
bandSchema.methods.removeMember = function(id, done){
    var index = _.findIndex(this.members, function(member){
        return member.id == id;
    });

    if (index == -1) return done(new Error('Bandmember not found.'));
    this.members.splice(index, 1);
    this.save(function(err, band){
        Band.populate(band, 'members.user', done);
    });
};


var Band = mongoose.model('Band', bandSchema);
module.exports = Band;