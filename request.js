module.exports = {

    ping: function(options, callback) {

        var https = require('https');

        var req = https.request(options, function(res) {
            console.log(res);
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                callback && callback(chunk); // Throw back
            });
        });

        req.end();
    },

    request: function(options, data, callback) {

        var https = require('https');
        var req  = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                callback && callback(chunk); // Throw back
            });
        });

        req.write(data);
        req.end();
    }
}
