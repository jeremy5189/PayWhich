/* -----------------------------------------------------------
 *
 *  PayWhich MasterCard Currency Bot
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.pw
 *
 * -----------------------------------------------------------
 */

var config  = require('./config.json'),
    curl    = require('./request.js'),
    parser  = require('xml2js').parseString,
    moment  = require('moment'),
    _debug  = false,
    options = {
        host: config.master.host,
        port: config.master.port,
        path: config.master.path,
        method: 'POST',
    	headers: {
    	  "Content-Length": 0,
    	  "Content-Type"  : "application/x-www-form-urlencoded",
    	  "Accept"        : "*/*",
          "User-Agent"    : config.master.user_agent
    	}
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

var target_date = moment().subtract(parseInt(process.argv[2]), 'day').format('MM/DD/YYYY'),
    post_data = 'service=getExchngRateDetails&baseCurrency=' + base_currency +
                '&settlementDate=' + target_date;

console.log("============= PayWhich MasterCard currency tool =============");
console.log('\nTarget date (Today - ' + process.argv[2] + '): ' + target_date);
console.log("Base Currency: " + base_currency);

options.headers['Content-Length'] = Buffer.byteLength(post_data);

if(_debug) {
    console.log("\nHTTP Post Options:");
    console.log(options);
}

curl.request(config.master.protocal, options, post_data, function(ret) {

    if(_debug) {
        console.log('\nRetrived MasterCard Currency Exchange Rate: ');
        //console.log(ret);
    }

    parser(ret, function(err, result) {

        //if(_debug)
    	console.log('\nParsed! MC Date: ' + result.PSDER.SETTLEMENT_DATE);

    	var it = result.PSDER.TRANSACTION_CURRENCY[0].TRANSACTION_CURRENCY_DTL,
    	    save = {};

    	for( var index in it ) {

    	    var iter = it[index],
                i = config.target.length;

    	    while( i-- ) {
    		    if( config.target[i] == iter.ALPHA_CURENCY_CODE ) {

                    if(_debug)
                        console.log(iter.ALPHA_CURENCY_CODE + ' ' + iter.CONVERSION_RATE);

                    save[iter.ALPHA_CURENCY_CODE] = iter.CONVERSION_RATE;
        		    break;
    		    }
    	    }
        }

        if(_debug) {
            console.log("\nPending array: ");
    	    console.log(save);
        }

        console.log("1 " + base_currency + " = " + save['TWD'] + ' NTD');

    	if (Object.keys(save).length > 0 ) {

            var db = require('./db.js');
    		db.insert(config.mysql, [
                'mastercard',
                result.PSDER.SETTLEMENT_DATE,
                base_currency,
                save['TWD'],
                moment().format('YYYY-MM-DD HH:mm:ss'),
                '{}'
    		], _debug);

    	} else {

            console.log('\nNo data to insert');

        }

    }); // End XML parse
}); // End curl
