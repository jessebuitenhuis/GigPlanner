var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: String,
    date: Date
});

Event = mongoose.model('Event', eventSchema);
module.exports = Event;