var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    bcrypt      = require('bcrypt'),
    tokenConfig = require('../config/token'),
    jwt = require('jsonwebtoken'),
    _ = require('underscore');

var userSchema = new Schema({
    name: {
        first: String,
        middle: String,
        last: String
    },
    email: String,
    password: {type: String, select: false},
    facebook: {
        id: String,
        displayName: String,
        photos: [{
            value: String
        }]
    },
    avatar: String,
    selected: Boolean
});

userSchema.virtual('name.full').get(function(){
    var parts = [];
    if (this.name.first) parts.push(this.name.first);
    if (this.name.middle) parts.push(this.name.middle);
    if (this.name.last) parts.push(this.name.last);
    return parts.join(' ');
});

// Methods =================================================
userSchema.methods.hashPassword = function(done) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
    done();
};

userSchema.methods.validatePassword = function(password) {
    return true;
    return bcrypt.compareSync(password.toString(), this.password);
};

userSchema.methods.createToken = function() {
    var token = jwt.sign({sub: this._id}, tokenConfig.secret, {expiresIn: '1hr'});
    return 'JWT ' + token;
};

userSchema.methods.saveAndFind = function(done) {
    this.save(function(err, user) {
        if (err) return done(err);
        User.findById(user._id, done);
    });
};

// Statics =================================================
userSchema.statics.findLinkedToEvent = function(eventId, done) {
    User.find({}, function(err, users) {
        if (err) return done(err);
        if (!users) return done();

        Event.findById(eventId).populate('bands.band').exec(function(err, event) {
            if (err) return done(err);

            // find linked Users (direct)
            var linkedUsers = event.users.map(function(user){
                return user.user.toString();
            });

            // add linked Users (through band connection)
            event.bands.forEach(function(band) {
                var usersInBand = band.band.members.map(function (member) {
                    return member.user.toString();
                });
                linkedUsers.push.apply(linkedUsers, usersInBand);
            });

            // add selected property if user is in linkedUser list
            users.forEach(function(user){
                if (linkedUsers.indexOf(user.id) != -1) {
                    user.selected = true;
                } else {
                    user.selected = false;
                }
            });

            done(null, users);
        });
    });
};

// Pre =====================================================
userSchema.pre('save', function(done){
    this.hashPassword(done);
    done();
});

// Configuration ===========================================
userSchema.set('toJSON', { getter: true, virtuals: true });
var User = mongoose.model('User', userSchema);

module.exports = User;