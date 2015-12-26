var config  = require('./config.json'),
    curl    = require('./request.js'),
    moment  = require('moment'),
    _debug  = false,
    options = {
        host: config.visa.host,
        port: 443,
        path: config.visa.path,
        method: 'GET',
    	headers: {
            'Accept': 'text/html',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
            'Cache-Control':   'max-age=0',
            'Connection':      'keep-alive',
            'Host':            'usa.visa.com',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    	}
    };

// Check arg 2
if( process.argv[2] != undefined && process.argv[2] == '-v' )
    _debug = true;

//var get_data = 'fromCurr=TWDNew+Taiwan+Dollar&toCurr=EUREuro&fee=0&exchangedate=12%2F26%2F2015&submitButton.x=108&submitButton.y=7&submitButton=Calculate+Exchange+Rates';

//options.headers['Content-Length'] = Buffer.byteLength(get_data);

console.log(options);

curl.ping(options, function(ret) {
    console.log(ret);
});
