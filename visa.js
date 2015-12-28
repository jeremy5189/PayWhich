var config  = require('./config.json'),
    curl    = require('./request.js'),
    moment  = require('moment'),
    _debug  = false,
    options = {
        host: config.visa.host,
        port: config.visa.port,
        path: config.visa.path,
        method: 'GET',
    	headers: {
            'Accept': 'text/html',
            'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
            'Cache-Control':   'max-age=0',
            'Connection':      'keep-alive',
            'Host':            'usa.visa.com',
            'Upgrade-Insecure-Requests': '1',
    	}
    };

// Check arg 1
if( process.argv[2] == undefined || isNaN(parseInt(process.argv[2])) ) {
    console.log('Usage: nodejs visa.js [minus_day] [-v]');
    process.exit(0);
}

// Check arg 2
if( process.argv[3] != undefined && process.argv[3] == '-v' )
    _debug = true;

var target_date = moment().subtract(parseInt(process.argv[2]), 'days').format('MM/DD/YYYY');
    get_data =  '?fromCurr=TWDNew+Taiwan+Dollar&' +
                'toCurr=EUREuro&' +
                'fee=0&' +
                'exchangedate=' + encodeURIComponent(target_date) + '&' +
                'submitButton.x=108&' +
                'submitButton.y=7&' +
                'submitButton=Calculate+Exchange+Rates';

options.path += get_data;

console.log('Target date: ' + target_date);

if(_debug) {
    console.log('\nGet data: ');
    console.log(get_data);
    console.log('\nHTTP options: ');
    console.log(options);
}

curl.ping(config.visa.protocal, options, function(ret) {

    if(_debug)
        console.log(ret);

    var rate, m, re = /.*Euro = <strong>([0-9]*\.[0-9]+|[0-9]+).*/;

    if ((m = re.exec(ret)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }

        if(_debug)
            console.log('Raw output: ' + m[1]);

        rate = parseFloat(m[1]);
        if(isNaN(rate)) {
            console.log('Parse Error');
        }
        else {

            var save = {
              CNY: null,
              GBP: null,
              HKD: null,
              JPY: null,
              THB: null,
              TWD: rate,
              USD: null,
            };

            console.log(rate);

            if(!_debug) {
                var db = require('./db.js');
                db.insert(config.mysql, save, 'visa', [
                    moment().format('YYYY-MM-DD H:m:s'),
                    target_date
                ], _debug);
            }
        }
    }
});
