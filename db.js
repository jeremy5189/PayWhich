/* -----------------------------------------------------------
 *
 *  PayWhich Currency Bot - Database Helper
 *  Author: Jeremy Yen (jeremy5189@gmail.com)
 *  License: MIT
 *  Repo: https://github.com/jeremy5189/payWhich
 *  Production: http://paywhich.patricks.tw
 *
 * -----------------------------------------------------------
 */

module.exports = {

    insert: function(config, data_arr, _debug) {

    	var mysql      = require('mysql');
    	var connection = mysql.createConnection({
    	  host     : config.host,
    	  user     : config.user,
    	  password : config.pass,
    	  database : config.db
    	});

        var sql = "INSERT INTO "
                  + config.tbl
                  + " (`int_org`, `settle_date`, `base_currency`, `TWD`, `created_at`, `json`) VALUES (?, ?, ?, ?, ?, ?)";

        sql = mysql.format(sql, data_arr);

        if(_debug) {
            console.log('SQL Data: ');
            console.log(data_arr);
            console.log(sql);
        }

        if(!_debug) {

            console.log('Prepare to connect');

            connection.connect();

        	connection.query(sql, function(err, rows, fields) {
        	  if (err) throw err;
              console.log("Insert success");
        	});

            connection.end();

        } else {
            console.log('\nWill not insert to DB if debug = ture');
        }
    }
}
