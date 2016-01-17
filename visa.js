/* -----------------------------------------------------------
 *
 *  PayWhich VISA Currency Bot - PhantomJS Headless Version
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.pw
 *
 * -----------------------------------------------------------
 */

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
            'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'deflate',
            'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-CN;q=0.2,nb;q=0.2',
            'Cache-Control'  : 'no-cache',
            'Connection':      'keep-alive',
            'Host':            'usa.visa.com',
            'Pragma':          'no-cache',
            'User-Agent':      config.visa.user_agent,
    	}
    };

// Check arg 1: minus_day
if( process.argv[2] == undefined || isNaN(parseInt(process.argv[2])) ) {
    console.log('Usage: nodejs visa.js [minus_day] [base_currency] {-v}');
    process.exit(0);
}

var base_currency = 'EUR';

// Check arg 2: base_currency
if( process.argv[3] != undefined )
    base_currency = process.argv[3];

// Check arg 3: -v
if( process.argv[4] != undefined && process.argv[4] == '-v' )
    _debug = true;

var target_date = moment().subtract(parseInt(process.argv[2]), 'days').format('MM/DD/YYYY');
    get_data =  '?fromCurr=TWDNew+Taiwan+Dollar&' +
                'toCurr=' + config.map.visa[base_currency].replace(/ /gi, "+") + '&' +
                'fee=0&' +
                'exchangedate=' + encodeURIComponent(target_date) + '&' +
                'submitButton.x=109&' +
                'submitButton.y=5&' +
                'submitButton=Calculate+Exchange+Rates';

options.path += get_data;

console.log("============= PayWhich VISA currency tool =============");
console.log('\nTarget date: ' + target_date);

if(_debug) {
    console.log('Query Curreny: ' + base_currency);
    console.log('\nHTTP options: ');
    console.log(options);
}

curl.ping(config.visa.protocal, options, function(ret) {

    if(_debug)
        console.log(ret);

    var NTD, m, re = /.* = <strong>([0-9]*\.[0-9]+|[0-9]+).*/;

    if ((m = re.exec(ret)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }

        if(_debug)
            console.log('\nRaw output: ' + m[1]);

        NTD = parseFloat(m[1]);

        if(isNaN(NTD)) {
            console.log('Parse Error');
        }
        else {

            console.log('NTD: ' + NTD);

            var db = require('./db.js');

            db.insert(config.mysql, [
                'visa',
                target_date, // settle_date
                base_currency,
                NTD,
                moment().format('YYYY-MM-DD HH:mm:ss')
            ], _debug);

        }
    }
});
