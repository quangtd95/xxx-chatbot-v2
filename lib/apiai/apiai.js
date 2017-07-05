var apiai = require('apiai');
var uuid = require('uuid');
var app = apiai("0480922f11484fd3b2bf3c13fd184c97");

var opt = {
	sessionId:uuid.v1()
}

module.exports = {
	query: function (response,text) {
		var request = app.textRequest(text, opt);

		request.on('response', function(responseFromAI) {
			response.writeHead(200, {"Content-Type": "application/json"});
			var json = JSON.stringify(responseFromAI);
			console.log(json);
			response.end(json);
		});

		request.on('error', function(error) {
			console.log("error when request to apiai.");
			console.log(error);
		});

		request.end();
	}
};

