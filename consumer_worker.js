/*
 * Constant
 */
const TUBE_NAME = 'DRRL2015';
const SUCCESS_LIMIT = 10;
const FAIL_LIMIT = 3;
const SUCCESS_TIMEOUT = 60*1000;
const FAIL_TIMEOUT = 3*1000;

const DB_SERVER = 'ds031842.mongolab.com';
const DB_PORT = 31842
const DB_USER = 'node';
const DB_PASSWD = 'node';

/*
 * Require Lib
 */
var fivebeans = require('fivebeans');
var util = require('util');
var httpGet = require('./libs/httpGet.js');
var mongoDB = require('./libs/mongoDBConnection.js');


var interval = null;
var successCount = 0;
var failCount = 0;


function getReadyJob(){
	var success = false;
	var readyJob = null;
	if(interval != null)
		clearInterval(interval);
	
	var fivebeansClient = new fivebeans.client('localhost', 11300);
	fivebeansClient.on('connect', function(){
		fivebeansClient.watch(TUBE_NAME, function(err, response){
			fivebeansClient.reserve(function(err, jobId, job){
				//readyJob = job;
				console.log('Got Job ID: ' + jobId);
				var from = JSON.parse(job).From;
				var to = JSON.parse(job).To;
				console.log('From: ' + from);
				console.log('To: ' + to);
				fivebeansClient.destroy(jobId, function(err){});
				fivebeansClient.end();
				var httpGetClient = new httpGet();
				httpGetClient.getCurrencyRate(from, to, function(rate){
	if(rate != ''){
		rate = (roundTo2dp(rate)).toFixed(2);
		//console.log('Rate:' + rate);
		var mongoDBClient = new mongoDB();
		setTimeout(mongoDBClient.InsertData(DB_SERVER, DB_PORT, DB_USER, DB_PASSWD, from, to, rate, function() {}),1000);
		successCount++;	
	}
	else{
		console.log('Request Fail');
		failCount++
	}
	reputJob(from, to);
	if(successCount < SUCCESS_LIMIT && failCount < FAIL_LIMIT) {
		
		if(success) 
			delay60s();
		else 
			delay3s();
	}
	else {
		console.log('Success Count:' + successCount);
		console.log('Fail Count:' + failCount);
		console.log('Process END');
		
	}
});
				
				
						
			});
		});
	})
	.on('error', function(err){
		fivebeansClient.end();
	})
	.on('close', function(){
		
	}).connect();
}

function reputJob(from, to){
	var fivebeansClient = new fivebeans.client('localhost', 11300);
	fivebeansClient.on('connect', function(){
		fivebeansClient.use(TUBE_NAME, function(err, response){
			var job = {'From':from, 'To':to};
			fivebeansClient.put(0, 0, 1, JSON.stringify(job),
			function(err, job_id){
				if(err) console.log(err);
				console.log('Inserted Job ID: ' + job_id);
				fivebeansClient.end();
			}
		);
		});
	})
	.on('error', function(err){
		fivebeansClient.end();
	})
	.on('close', function(){
		
	}).connect();
}

function delay60s(){
	interval = setInterval(function(){ getReadyJob();}, SUCCESS_TIMEOUT);
}

function delay3s(){
	interval = setInterval(function(){ getReadyJob();}, FAIL_TIMEOUT);
}
function roundTo2dp(number){
	return Math.round(number * 100) / 100;
}

module.exports = function(callback){
	getReadyJob();
};

