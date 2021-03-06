var apiai = require('../lib/apiai/apiai.js');

module.exports = {
	getHome : function (req,res) {
		var title = 'BANKCHATBOT - THAI DUY QUANG (FHO-CTC)';
		res.render( "index",{title:title,host:process.env.LOCAL_HOST||'xxxchatbotv2.herokuapp.com',port:process.env.LOCAL_PORT||process.env.PORT});
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