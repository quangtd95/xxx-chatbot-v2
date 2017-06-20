var apiai = require('../lib/apiai/apiai.js');

module.exports = {
	getHome : function (req,res) {
		res.render( "index",{title:'Bankchatbot-THAI DUY QUANG '});
	},
	postQuery : function (req,res) {
		var body = '';
		req.on('data', function (data) {
			if (data)
				body += data;
		});
		req.on('end', function () {
			body = decodeURIComponent(decodeURIComponent(body));
			apiai.query(res,body);
		});   
	}
}