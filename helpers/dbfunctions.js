var db = require('../config/db');

var View = function(name, methods) {
    this.language = "javascript";
    this._id = "_design/" + name;
    this.views = methods;
};
View.prototype.insert = function(){
    var self = this;

    db.get(self._id, function(err, body) {
        if (body) self._rev = body._rev;

        db.insert(self, function(err){
            if (err) throw new Error('Could not publish databaseView ' + self._id);
        });
    });
};

var views = [];

views.push(new View('users', {
    "all": {
        "map":"function(doc){ if(doc.type == 'User') emit(null,doc); }"
    }
}));

views.push(new View('events', {
    "all": {
        "map":"function(doc){ if(doc.type == 'Event') emit(null,doc); }"
    }
}));

views.push(new View('bands', {
    "all": {
        "map":"function(doc){ if(doc.type == 'Band') emit(null,doc); }"
    }
}));

exports.init = function(){
    views.forEach(function(view){
        view.insert();
    });
};