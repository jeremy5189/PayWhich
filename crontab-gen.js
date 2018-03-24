/* -----------------------------------------------------------
 *
 *  PayWhich Currency Bot - Crontab Script Generator
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.patricks.tw
 *
 * -----------------------------------------------------------
 */

var config = require('./config.json'),
    min = 0,
    _headless = false,
    _cron = true;

if( process.argv[2] == '--help') {
    console.log('node crontab-gen.js [--nocron] [--visa/master]');
    process.exit(0);
}

if( process.argv[2] == '--nocron' ) {
    _cron = false;
}

var only = 'all';
if( process.argv[3] !== undefined )
    only = process.argv[3];

var cron = '';

for( var cur in config.map.visa) {

    if( _cron ) {
        cron = min + ' 0,6,12,18 * * * ';
    }

    console.log('\n# PayWhich ' + cur);
    
    if (only == 'all') {
        console.log(cron + config.node_bin + ' ' + config.path + 'master.js 1 ' + cur);
        console.log(cron + config.node_bin + ' ' + config.path + 'visa-w3m.js 0 ' + cur);
    } else if( only == '--master' ) {
        console.log(cron + config.node_bin + ' ' + config.path + 'master.js 1 ' + cur);
    } else if ( only == '--visa' ) {
        console.log(cron + config.node_bin + ' ' + config.path + 'visa-w3m.js 0 ' + cur);
    }

    min++;
 }

console.log('\n# JCB');
console.log(cron + config.node_bin + ' ' + config.path + 'jcb.js 1');
