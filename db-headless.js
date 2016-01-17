/* -----------------------------------------------------------
 *
 *  PayWhich Currency Bot - Database Command-line Helper
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.pw
 *
 * -----------------------------------------------------------
 */

var db     = require('./db.js'),
    config = require('./config.json');

if( process.argv.length < 7 ) {
    console.log("Usage: node db-headless.js [int_org] [target_date] [base_currency] [NTD] [server_date]");
    process.exit();
}

db.insert(config.mysql, [
    process.argv[2], // 'visa',
    process.argv[3], // target_date, // settle_date
    process.argv[4], // base_currency,
    process.argv[5], // NTD,
    process.argv[6]  // moment().format('YYYY-MM-DD HH:mm:ss')
], false);
