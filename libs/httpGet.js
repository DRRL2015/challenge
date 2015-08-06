var httpClient = require('http');
var strLib = require('string');

var httpGet = function(){

};
httpGet.prototype.getCurrencyRate = function(from, to, callback){
	var options = {
		host:'www.xe.com',
		path:'/currencyconverter/convert/?Amount=1&From=' + from + '&To=' + to
	};

	httpClient.request(options, function(response){
		var html_str = '';
		var prefix_str = strLib('<td width="47%" align="left" class="rightCol">');
		var surfix_str = strLib('<span class="uccResCde">' + to + '</span>');
		response.on('data', function(chunk){
			html_str += chunk;
		});
		response.on('end', function(){
			var str = strLib(html_str).between(prefix_str, surfix_str);
			var pos = strLib(str).indexOf('&');
			str = strLib(str).left(pos).s;
			callback(str);
		});
	}).end(); 
	
};

module.exports = httpGet;
