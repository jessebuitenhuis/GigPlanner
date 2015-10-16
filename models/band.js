var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bandSchema = new Schema({
    name: String,
    members: [{
        roles: [String],
        user: { type: Schema.Types.ObjectId, ref:'User' }
    }]
});

var Band = mongoose.model('Band', bandSchema);
module.exports = Band;