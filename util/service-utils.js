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
	var contexts = [];
	var reply = "Who do you want to send money to? Please type ONLY and EXACTLY full name";
	var source = ""	;
	api_util.removeContext(contexts,'ask_service');;
	api_util.addContext(contexts,'ask_name_to_send',3,{})
	api_util.addContext(contexts,'send_money',100,{});
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}