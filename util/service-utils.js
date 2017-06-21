var object = require('../model/object.js');
var api_util = require('../util/apiai-utils.js');
module.exports = {
	handle : function (action,req,res,account) {
		switch (action) {
			case 'service.user.want.send.money':
			chooseServiceSendMoney(req,res,account);
			break;
		}		
	}
}

function chooseServiceSendMoney(request,response,account){
	var name_context= 'send_money';
	var lifespan = 3;
	var contexts = [];
	var reply = "Who do you want to send money to?";
	var source = ""	;
	contexts.push(new object.Context('ask_service',0,{}));
	contexts.push(new object.Context(name_context,lifespan,{}));
	console.log(contexts);
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}