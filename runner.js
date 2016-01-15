var config = require('./config.json');

console.log('#!/bin/bash');

for( var cur in config.map.visa) {
    console.log('\nnode visa.js 0 ' + cur);
    console.log('node master.js 1 ' + cur);
    console.log('node jcb.js 0 ' + cur);
}
