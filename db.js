module.exports = {

    insert: function(config, data, table, datetime_arr, _debug) {

    	var mysql      = require('mysql');
    	var connection = mysql.createConnection({
    	  host     : config.host,
    	  user     : config.user,
    	  password : config.pass,
    	  database : config.db
    	});

    	connection.connect();
     	var sql = 'INSERT INTO `' + table + '` (`datetime`, `CNY`, `GBP`, `HKD`, `JPY`, `THB`, `TWD`, `USD`, `settle_date`) VALUES (';

    	sql += "'" + datetime_arr[0] + "'";

    	for( var i in data ) {
    	  sql += ",'" + data[i] + "'";
    	}

    	sql += ",'" + datetime_arr[1] + "');";

     	console.log("\n" + sql);

        if(!_debug) {
        	connection.query(sql, function(err, rows, fields) {
        	  if (err) throw err;
        	});
        } else {
            console.log('\nWill not insert to DB if debug = ture');
        }

    	connection.end();
    }
}
