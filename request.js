/* -----------------------------------------------------------
 *
 *  PayWhich Currency Bot - HTTP Request helper
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.pw
 *
 * -----------------------------------------------------------
 */

var self = module.exports = {

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
    },

    w3m: function(w3m_path, url, callback) {
        self.shell(w3m_path, ['-dump', url], function(output) {
            callback(output);
        });
    },

    shell: function (cmd, args, callback ) {

        var spawn = require('child_process').spawn;
        var child = spawn(cmd, args);
        var resp = "";

        child.stdout.on('data', function (buffer) { 
            resp += buffer.toString() 
        });

        child.stdout.on('end', function() { 
            callback (resp) 
        });
    } 
}
