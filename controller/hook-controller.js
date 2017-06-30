var account;
var login_util = require('../util/login-utils.js');
var service_util = require('../util/service-utils.js');
var send_money_util = require('../util/send-money-utils.js');
module.exports = {
	hook : function (req,res,socket) {
		var action = String(req.body.result.action);
		var category = action.substring(0, action.indexOf('.'));
		switch (category){
			case 'login':
			login_util.handle(action,req,res,account);
			break;			
			case 'service':
			service_util.handle(action,req,res,account);
			break;
			case 'sendmoney':
			send_money_util.handle(action,req,res,account,socket);
			break;
		}
	}
}




