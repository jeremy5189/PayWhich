var config  = require('./config.json'),
    curl    = require('./request.js'),
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
    },
    post_data = 'service=getExchngRateDetails&baseCurrency=EUR&settlementDate=12/23/2015';
 
options.headers['Content-Length'] = Buffer.byteLength(post_data);

console.log(options);

curl.request(options, post_data, function(ret) {
    console.log(ret);
});

