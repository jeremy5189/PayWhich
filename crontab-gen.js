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
    _headless = false;

if( process.argv[2] == '--headless') {
    _headless = true;
}

for( var cur in config.map.visa) {
    console.log('\n# PayWhich ' + cur);
    console.log(min + ' 0,6,12,18 * * * ' + config.node_bin + ' ' + config.path + 'visa.js 0 ' + cur);

    if( _headless)
        console.log(min + ' 0,6,12,18 * * * ' + config.phantomjs_bin + ' ' + config.path + 'visa-headless.js 0 ' + cur);
    else
        console.log(min + ' 0,6,12,18 * * * ' + config.node_bin + ' ' + config.path + 'master.js 1 ' + cur);

    //console.log(min + ' 0,6,12,18 * * * /usr/bin/node ' + config.path + 'jcb.js 0 ' + cur);
    min++;
}
