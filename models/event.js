var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    helpers = require('../helpers'),
    _ = require('underscore');

var types = 'rehearsal gig meeting'.split(' ');
var statuses = 'option confirmed cancelled deleted'.split(' ');

var eventSchema = new Schema({
    name: String,
    type: { type: String, enum: types},
    date: Date,
    status: { type: String, enum: statuses },
    bands: [{
        role: String,
        band: { type: Schema.Types.ObjectId, ref: 'Band' }
    }],
    users: [{
        role: String,
        user: {type: Schema.Types.ObjectId, ref: 'User' }
    }]
});

// Methods ===================================================

eventSchema.methods.addBands = function(bands, done){
    if (!Array.isArray(bands)) bands = [bands];

    var bandsToAdd = helpers.uniqueItems(bands, this.bands, 'band');
    if (!bandsToAdd.length) return done(new Error('All bands provided are already linked to this event.'));

    bandsToAdd = bandsToAdd.map(function(band){
        return {
            roles: [],
            band: band
        };
    });

    this.bands.push.apply(this.bands, bandsToAdd);
    this.save(function(err, event){
        Event.populate(event, 'bands.band', done);
    });
};
eventSchema.methods.removeBand = function(docId, done){
    var index = _.findIndex(this.bands, function(u){ return u._id == docId; });

    if (index == -1) return done(new Error('Band is not linked to this event.'));
    this.bands.splice(index, 1);
    this.save(function(err, event){
        if (err) return done(err);

        Event.populate(event, 'bands.band', done);
    });
};
eventSchema.methods.addUsers = function(users, done){
    if (!Array.isArray(users)) users = [users];

    var usersToAdd = helpers.uniqueItems(users, this.users, 'user');

    var linkedUsers = [];
    var _this = this;

    // @TODO Refactor to something more beautiful
    // List all users linked trough bands
    Event.populate(_this, 'bands.band', function(err, event){
        event.bands.forEach(function(band){
            if (!band) return false;
            var users = _.pluck(band.band.members, 'user');
            linkedUsers.push.apply(linkedUsers, users);
        });

        linkedUsers = linkedUsers.map(function(lu){
            return lu.toString();
        });
                usersToAdd = _.difference(usersToAdd, linkedUsers);

        if (!usersToAdd.length) return done(new Error('All users provided are already linked to this event.'));

        usersToAdd = usersToAdd.map(function(user){
            return {
                roles: [],
                user: user
            };
        });

        _this.users.push.apply(_this.users, usersToAdd);
        _this.save(function(err, event){
            Event.populate(event, 'users.user', done);
        });
    });
};
eventSchema.methods.removeUser = function(docId, done){
    var index = _.findIndex(this.users, function(u){ return u._id == docId; });

    if (index == -1) return done(new Error('User not linked to this event.'));
    this.users.splice(index, 1);
    this.save(function(err, event){
        if (err) return done(err);

        Event.populate(event, 'users.user', done);
    });
};


Event = mongoose.model('Event', eventSchema);
module.exports = Event;