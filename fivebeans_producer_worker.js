var fivebeans = require('fivebeans');
var host = 'localhost';
var port = 11300;
var tube = 'DRRL2015'

var producer = new fivebeans.client(host, port);
producer.on('connect', function() {
	producer.use(tube, function(err, tubename){
		var data = {'From':'USD', 'To':'HKD'};
		producer.put(0, 0, 1, JSON.stringify(data),
			function(err, job_id){
				if(err) console.log(err);
				console.log('Inserted Job ID: ' + job_id);
				producer.end();
			}
		);
	});
})
.on('error', function(err){
	console.log('Error: ' + err);
})
.on('close', function(){
	console.log('Inserted Job is Done');
	
}).connect();
