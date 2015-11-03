var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');

var types = 'rehearsal gig meeting'.split(' ');
var statuses = 'option confirmed cancelled deleted'.split(' ');
var available = 'no maybe yes'.split(' ');

var eventSchema = new Schema({
    name: String,
    type: { type: String, enum: types},
    date: Date,
    status: { type: String, enum: statuses },
    creator: { type: Schema.Types.ObjectId, ref: 'User'},
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true},
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    available: [{
        user: { type: Schema.Types.ObjectId, ref: 'User'},
        status: {type: String, enum: available}
    }]
});

// Methods ===================================================
eventSchema.methods.addUsers = function(users, done){
    if (!users) return done(new Error('1 or more userids are required'));
    if (!Array.isArray(users)) users = [users];

    var _this = this;

    var linkedUsers = _this.users;

    Event.populate(_this, 'band', function(err, event){
        if (err) return done(err);

        if (_this.band && _this.band.members) {
            var bandUsers = _.pluck(_this.band.members, 'user');
            linkedUsers.push.apply(linkedUsers, bandUsers);
        }

        users = users.map(String);
        linkedUsers = linkedUsers.map(String);

        var usersToAdd = _.difference(users, linkedUsers);
        console.log(users, linkedUsers, usersToAdd);

        if (!usersToAdd.length) return done(new Error('All users provided are already linked to this event.'));

        _this.users.push.apply(_this.users, usersToAdd);

        Event.findByIdAndUpdate(_this._id, {users: _this.users}, {new:true}, function(err, event){
            Event.populate(event, 'users band', done);
        });
    });
};
eventSchema.methods.removeUser = function(userId, done){
    var index = _.findIndex(this.users, function(u){ return u.toString() == userId; });

    if (index == -1) return done(new Error('User not linked to this event.'));
    this.users.splice(index, 1);
    this.save(function(err, event){
        if (err) return done(err);

        Event.populate(event, 'users band', done);
    });
};


Event = mongoose.model('Event', eventSchema);
module.exports = Event;