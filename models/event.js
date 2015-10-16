var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var types = 'rehearsal gig meeting'.split(' ');
var statuses = 'option confirmed cancelled deleted'.split(' ');

var eventSchema = new Schema({
    name: String,
    type: { type: String, enum: types},
    date: Date,
    status: { type: String, enum: statuses },
    bands: [{ type: Schema.Types.ObjectId, ref: 'Band' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

Event = mongoose.model('Event', eventSchema);
module.exports = Event;