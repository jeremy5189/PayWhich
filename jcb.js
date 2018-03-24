/* -----------------------------------------------------------
 *
 *  PayWhich JCB Currency Bot
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.patricks.tw
 *
 * -----------------------------------------------------------
 */

var config  = require('./config.json'),
    curl    = require('./request.js'),
    moment  = require('moment'),
    sprintf = require('sprintf-js').sprintf,
    _debug  = false,
    options = {
        host: config.jcb.host,
        port: config.jcb.port,
        path: config.jcb.path,
        method: 'GET',
    	headers: {
            'Accept'         : 'text/html',
            'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
            'Cache-Control'  : 'max-age=0',
            'Connection'     : 'keep-alive'
    	}
    };

// Check arg 1
if( process.argv[2] == undefined || isNaN(parseInt(process.argv[2])) ) {
    console.log('Usage: nodejs jcb.js [minus_day] [-v]');
    process.exit(0);
}

// Check arg 2
if( process.argv[3] != undefined && process.argv[3] == '-v' )
    _debug = true;

var target_date = moment().subtract(parseInt(process.argv[2]), 'day').format('YYYYMMDD');

options.path = sprintf(options.path, target_date);

console.log("============= PayWhich JCB currency tool =============");
console.log('\nTarget date (Today - ' + process.argv[2] + '): ' + target_date);
console.log('Path: ' + options.path);

if(_debug) {
    console.log('\nHTTP options: ');
    console.log(options);
}

var obj  = {},
    save = {},
    ended = false;

curl.ping(config.jcb.protocal, options, function(ret) {

    var csv = require('csv-parser'),
        Readable = require('stream').Readable;

    var s = new Readable;
    s.push('base,=,buy,mid,sell,exchange,,,,' + ret);
    s.push(null);   // Stream end

    // Data stream on row
    s.pipe(csv()).on('data', function(data) {

        if( data.exchange != undefined )
            obj[data.exchange] = data.mid;

    });

    s.on('end', function() {

        if(ended)
            return;

        for( var cur in config.map.visa ) {

            if( obj[cur] == undefined )
                return;

            if( cur == 'USD' )
                cur = 'TWD';

            save[cur] = obj[cur];
        }

        console.log(save);
        ended = true;

        var db = require('./db.js');

        db.insert(config.mysql, [
            'jcb',
            target_date,
            'USD',
            0,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            JSON.stringify(save)
        ], _debug);

    });

});
