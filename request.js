module.exports = {

    ping: function(protocal, options, callback) {

        var https = require(protocal);

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                callback && callback(chunk); // Throw back
            });
        });

        req.end();
    },

    request: function(protocal, options, data, callback) {

        var https = require(protocal);
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
