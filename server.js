var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var route = require('./route/route.js');
var server = require('http').Server(app);
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine','ejs');

var sess = {
	secret: 'quangtd7',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}
app.use(session(sess));

server.listen(process.env.PORT || 5000,function () {
	var host = server.address().address
	var port = server.address().port
	console.log("running: "+host+":"+port);
});

route.setRoute(app);

