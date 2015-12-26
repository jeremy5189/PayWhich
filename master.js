var config  = require('./config.json'),
    curl    = require('./request.js'),
    parser  = require('xml2js').parseString,
    moment  = require('moment'),
    _debug  = false,
    options = {
        host: config.master.host,
        port: 443,
        path: config.master.path,
        method: 'POST',
    	headers: {
    	  "Content-Length": 0,
    	  "Content-Type"  : "application/x-www-form-urlencoded",
    	  "Accept"        : "*/*"
    	}
    };

// Check arg 1
if( process.argv[2] == undefined || isNaN(parseInt(process.argv[2])) ) {
    console.log('Usage: nodejs master.js [minus_day] [-v]');
    process.exit(0);
}

// Check arg 2
if( process.argv[3] != undefined && process.argv[3] == '-v' )
    _debug = true;

var target_date = moment().subtract(parseInt(process.argv[2]), 'day').format('MM/DD/YYYY'),
    post_data = 'service=getExchngRateDetails&baseCurrency=EUR&settlementDate=' + target_date;

console.log('Target date (Today - ' + process.argv[2] + '): ' + target_date);

options.headers['Content-Length'] = Buffer.byteLength(post_data);

if(_debug) {
    console.log("\nHTTP Post Options:");
    console.log(options);
    console.log("\nTarget Curreny List:");
    console.log(config.target);
}

curl.request(options, post_data, function(ret) {

    if(_debug) {
        console.log('\nRetrived MasterCard Currency Exchange Rate: ');
        console.log(ret);
    }

    parser(ret, function(err, result) {

        if(_debug)
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

    	if (Object.keys(save).length > 0 && !_debug ) {

            var db = require('./db.js');
    		db.insert(config.mysql, save, 'mastercard', [
                moment().format('YYYY-MM-DD H:m:s'),
    		    result.PSDER.SETTLEMENT_DATE
    		]);

    	} else if( _debug ) {

            console.log('\nWill not insert to DB if debug = ture');

        } else {

            console.log('\nNo data to insert');

        }

    }); // End XML parse
}); // End curl
