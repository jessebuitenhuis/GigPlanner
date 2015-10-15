var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bandSchema = new Schema({
    name: String
});

var Band = mongoose.model('Band', bandSchema);
module.exports = Band;