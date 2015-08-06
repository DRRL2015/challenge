const MAX_CONCURRENT_TASK = require('os').cpus().length
var workerFarm = require('worker-farm');
var worker = workerFarm(require.resolve('./consumer_worker'));
var ret = 0;

for(var i = 0; i < MAX_CONCURRENT_TASK; i++){
	worker(function(){
		ret++;
		if(ret >= MAX_CONCURRENT_TASK)
			workerFarm.end();
	});
}
