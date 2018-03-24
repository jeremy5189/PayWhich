/* -----------------------------------------------------------
 *
 *  PayWhich MasterCard Currency Bot
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
    _debug  = false,
    options = {
        host: config.master.host,
        port: config.master.port,
        path: config.master.path,
        method: 'GET',
    	headers: {
          "Referer"       : "https://www.mastercard.us/en-us/consumers/get-support/convert-currency.html",
    	  "Accept"        : "application/json, text/plain, */*",
          "User-Agent"    : config.master.user_agent
        },
        rejectUnauthorized: false,
    };

// Check arg 1: minus_day
if( process.argv[2] == undefined || isNaN(parseInt(process.argv[2])) ) {
    console.log('Usage: nodejs master.js [minus_day] [base_currency] {-v}');
    process.exit(0);
}

var base_currency = 'EUR';

// Check arg 2: base_currency
if( process.argv[3] != undefined )
    base_currency = process.argv[3];

// Check arg 3: -v
if( process.argv[4] != undefined && process.argv[4] == '-v' )
    _debug = true;

var target_date = moment().subtract(parseInt(process.argv[2]), 'day').format('YYYY-MM-DD'),
    get_query   = 'fxDate='     + target_date + 
                  ';transCurr=' + base_currency + 
                  ';crdhldBillCurr=' + config.target[0] + 
                  ';bankFee=0.00;transAmt=1.00/conversion-rate';

console.log("============= PayWhich MasterCard currency tool =============");
console.log('\nTarget date (Today - ' + process.argv[2] + '): ' + target_date);
console.log("Base Currency: " + base_currency);

//options.headers['Content-Length'] = Buffer.byteLength(post_data);
options.path += get_query;

if(_debug) {
    console.log("\nHTTP GET Options:");
    console.log(options);
}

curl.ping(config.master.protocal, options, function(ret) {

    if(_debug) {
        console.log('\nRetrived Raw Data: ');
        console.log(ret);
    }

    try {

        var obj = JSON.parse(ret);

        if (_debug) {
            console.log("\n JSON obj: ");
            console.log(obj);
        }

        if (obj.type !== 'error') {

            var arr = [
                'mastercard',
                obj.data.fxDate,
                base_currency,
                obj.data.conversionRate,
                obj.date,
                '{}'
            ];

            var db = require('./db.js');
            db.insert(config.mysql, arr, _debug);

        } else {
            
            console.error('Mastercard returns error');
            console.error(obj.data.errorMessage);
        }

    }
    catch(e)
    {
        console.error('Invalid JSON');
        process.exit(0);
    }
}); // End curl
