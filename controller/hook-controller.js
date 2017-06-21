var db = require('../lib/db/dbHelper.js');
var object = require('../model/object.js');
var api_util = require('../util/apiai-utils.js');
var login_util = require('../util/login-utils.js');
var service_util = require('../util/service-utils.js');
var account;

module.exports = {
	hook : function (req,res) {
		var action = String(req.body.result.action);
		var category = action.substring(0, action.indexOf('.'));
		console.log("category of intent: "+category);;
		switch (category){
			case 'login':
			login_util.handle(action,req,res,account);
			break;			
			case 'service':
			service_util.handle(action,req,res,account);
			break;


		}
	}
}




