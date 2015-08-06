var mongoDBClient = require('mongodb').MongoClient;
var assert = require('assert');


mongoDBConnection = function (){

};

mongoDBConnection.prototype.InsertData = function (server, port, username, passwd, from, to, rate, callback){
	var url = 'mongodb://' + username + ':' + passwd + '@' + server + ':' + port + '/currency_record';
	//console.log(url);
	//console.log('rate' + rate);
	
	
	mongoDBClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('currency').insertOne(
		{
			'from':from,
			'to':to,
			'createTime':Date.now(),
			'rate':rate
		},
		function(err, result){
								
			assert.equal(err, null);
			db.close();
			callback();
		});
	});
	
};

module.exports = mongoDBConnection;
