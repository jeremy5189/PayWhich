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
    min = 0;

for( var cur in config.map.visa) {
    console.log('\n# PayWhich ' + cur);
    console.log(min + ' 0,6,12,18 * * * /usr/bin/node ' + config.path + 'visa.js 0 ' + cur);
    console.log(min + ' 0,6,12,18 * * * /usr/bin/node ' + config.path + 'master.js 1 ' + cur);
    //console.log(min + ' 0,6,12,18 * * * /usr/bin/node ' + config.path + 'jcb.js 0 ' + cur);
    min++;
}
