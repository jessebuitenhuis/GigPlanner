exports.errorHandler = function(err, req, res, next){
    var message = err.message;

    if (err) {

        if (err.name === 'ValidationError') {
            var errors = [];
            for (var key in err.errors) {
                errors.push(err.errors[key].message);
            }
            message = errors.join(' ');
        }

        res.status(err.status || 400);
        res.send(message);
    }
};