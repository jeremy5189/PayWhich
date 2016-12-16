/* ----------------------------------------------------------
 *
 *  PayWhich VISA Currency Bot - w3m Version
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.pw
 *
 * -----------------------------------------------------------
 */

var config  = require('./config.json'),
	request = require('./request.js'),
	moment  = require('moment'),
	base_currency = 'EUR';

// Check arg 1: minus_day
if( process.argv[2] == undefined || isNaN(parseInt(process.argv[2])) ) {
    console.log('Usage: nodejs visa.js [minus_day] [base_currency] {-v}');
    process.exit(0);
}

// Check arg 2: base_currency
if( process.argv[3] != undefined )
    base_currency = process.argv[3];

// Check arg 3: -v
if( process.argv[4] != undefined && process.argv[4] == '-v' )
    _debug = true;

var target_date = moment().subtract(parseInt(process.argv[2]), 'days').format('MM/DD/YYYY');
    get_data =  '?fromCurr=TWD&' +
                'toCurr=' + base_currency + '&' +
                'fee=0&' +
                'exchangedate=' + encodeURIComponent(target_date) + '&' +
                'submitButton.x=138&' +
                'submitButton.y=16&' +
                'submitButton=Calculate+Exchange+Rates';

var url	= config.visa.protocal + '://' +
		  config.visa.host + 
		  config.visa.path +
		  get_data;

console.log("============= PayWhich VISA currency tool =============");
console.log('\nTarget date: ' + target_date);

if(_debug) {
    console.log('Query Curreny: ' + base_currency);
    console.log('\nGET Query: ');
    console.log(url);
    console.log("----------------");
}

request.w3m(config.w3m_bin, url, function(output) {

	if(_debug) {
		console.log(output);
		console.log("----------------");
	}

	var NTD, m, re = /.* = ([0-9]*\.[0-9]+|[0-9]+).*/;

    if ((m = re.exec(output)) !== null) {
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
                moment().format('YYYY-MM-DD HH:mm:ss'),
                '{}' // Empty json
            ], _debug);

        }
    }
});