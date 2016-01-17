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

var page    = require('webpage').create(),
    system  = require('system'),
    moment  = require('moment'),
    config  = require('./config.json'),
    _debug  = false,
    base_currency = 'EUR',
    url = config.visa.protocal + '://' +
          config.visa.host +
          config.visa.path;

// Check arg 1: minus_day
if( system.args[1] == undefined || isNaN(parseInt(system.args[1])) ) {
    console.log('Usage: phantomjs visa-headless.js [minus_day] [base_currency] {-v}');
    phantom.exit();
}

// Check arg 2: base_currency
if( system.args[2] != undefined )
    base_currency = system.args[2];

// Check arg 3: -v
if( system.args[3] != undefined && system.args[3] == '-v' )
    _debug = true;

var target_date = moment().subtract(parseInt(system.args[2]), 'days').format('MM/DD/YYYY');
    get_data =  '?fromCurr=TWDNew+Taiwan+Dollar&' +
                'toCurr=' + config.map.visa[base_currency].replace(/ /gi, "+") + '&' +
                'fee=0&' +
                'exchangedate=' + encodeURIComponent(target_date) + '&' +
                'submitButton.x=109&' +
                'submitButton.y=5&' +
                'submitButton=Calculate+Exchange+Rates';

url += get_data;

console.log("============= PayWhich VISA currency tool (Phantomjs Version) =============");
console.log('\nTarget date: ' + target_date);

page.open(url, function (status) {

    if (status === 'fail') {

        if(_debug)
            console.log('PhantomJS Fail!');

    }
    else {

        if(_debug)
            console.log('PhantomJS Success');

        var data = page.evaluate(function() {
            return document.querySelector('div.result_table p strong').innerText;
        });

        if(_debug) {
            console.log('Raw Data: ');
            console.log(data);
        }

        var NTD = parseFloat(data.split(' ')[3]);

        if( isNaN(NTD) ) {
            console.log('Parse Float Error!');
        } else {

            console.log('Parse Successed');

        }

    }
    page.close();
    phantom.exit();
});
