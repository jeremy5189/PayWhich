var config  = require('./config.json'),
    curl    = require('./request.js'),
    moment  = require('moment'),
    _debug  = false,
    options = {
        host: config.jcb.host,
        port: config.jcb.port,
        path: config.jcb.path,
        method: 'GET',
    	headers: {
            'Accept': 'text/html',
            'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
            'Cache-Control':   'max-age=0',
            'Connection':      'keep-alive',
            'Upgrade-Insecure-Requests': '1',
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

if(_debug) {
    console.log('\nHTTP options: ');
    console.log(options);
}

curl.ping(config.jcb.protocal, options, function(ret) {

    if(_debug)
        console.log(ret);

    var arr = ret.split('<tr>');

    for( var i = 1; i < arr.length; i++ ) {
        var str = arr[i].split('<strong>');
        //console.log(str);
        var currency = str[1].split('</strong>')[0];
        //    value    = str[4].split('</strong>')[0].trim();

        setTimeout(function(){
            if(str[4]==undefined)
                console.log(arr[1]);
            console.log(currency);
        }, 1000);
    }

});
