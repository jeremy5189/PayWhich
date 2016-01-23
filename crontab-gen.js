/* -----------------------------------------------------------
 *
 *  PayWhich Currency Bot - Crontab Script Generator
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.pw
 *
 * -----------------------------------------------------------
 */

var config = require('./config.json'),
    min = 0,
    _headless = false,
    _cron = true;

if( process.argv[2] == '--help') {
    console.log('node crontab-gen.js [--headless] [--nocron]');
    process.exit(0);
}

if( process.argv[2] == '--headless') {
    _headless = true;
}

if( process.argv[3] == '--nocron' ) {
    _cron = false;
}

var cron = '';

for( var cur in config.map.visa) {

    if( _cron ) {
        cron = min + ' 0,6,12,18 * * * ';
    }

    console.log('\n# PayWhich ' + cur);
    console.log(cron + config.node_bin + ' ' + config.path + 'master.js 1 ' + cur);

    if( _headless) {
        cron = min + ' 0,12 * * * ';
        console.log(cron + config.phantomjs_bin + ' ' + config.path + 'visa-headless.js 0 ' + cur);
    }
    else {
        console.log(cron + config.node_bin + ' ' + config.path + 'visa.js 0 ' + cur);
    }

    min++;
 }

console.log('\n# JCB');
console.log(cron + config.node_bin + ' ' + config.path + 'jcb.js 1');
