var config  = require('./config.json'),
    curl    = require('./request.js'),
    parser  = require('xml2js').parseString,
    moment  = require('moment'),
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

var target_date = moment().subtract(parseInt(process.argv[2]), 'day').format('MM/DD/YYYY');
console.log('Target date: ' + target_date);
var post_data = 'service=getExchngRateDetails&baseCurrency=EUR&settlementDate=' + target_date;

options.headers['Content-Length'] = Buffer.byteLength(post_data);

//console.log(options);
console.log(config.target);

curl.request(options, post_data, function(ret) {

    console.log('MasterCard Currency Exchange Rate');
    console.log(ret);
    parser(ret, function(err, result) {

	console.log('Date: ' + result.PSDER.SETTLEMENT_DATE);

        //console.log(result.PSDER.TRANSACTION_CURRENCY[0].TRANSACTION_CURRENCY_DTL);
	var it = result.PSDER.TRANSACTION_CURRENCY[0].TRANSACTION_CURRENCY_DTL,
	    save = {};

	for( var index in it ) {

	    var iter = it[index];
	    //console.log(iter.ALPHA_CURENCY_CODE);
	    
            var i = config.target.length;
	    while( i-- ) {
		if( config.target[i] == iter.ALPHA_CURENCY_CODE ) {
		    console.log(iter.ALPHA_CURENCY_CODE + ' ' + iter.CONVERSION_RATE);
		    save[iter.ALPHA_CURENCY_CODE] = iter.CONVERSION_RATE;
		    break;
		}
	    }
        }

	console.log(save);
        if (Object.keys(save).length > 0) {
	//if(save.length > 0) {
	        var db = require('./db.js');

		db.insert(config.mysql, save, 'mastercard', moment().format('YYYY-MM-DD H:m:s'));
	}
    });
});

