var object = require('../model/object.js');
var api_util = require('../util/apiai-utils.js');
var db = require('../db/dbHelper.js');
module.exports = {
	handle : function (action,req,res) {
		switch (action) {
			case 'balance.user.ask':
			askBalance(req,res);
			break;
		}		
	}
}
function askBalance(request,response){
	var reply;
	var contexts = [];
	var source;
	var curAccount = api_util.getParamsOfContext(request,'authentication_pass').account_number;
	db.checkBalance(curAccount,function(success,data)){
		if (!success){
			reply = "sorry, server is unavailable now. please try again later!";
		} else {
			reply = "You have "+data+" vnd now. What do you want to do next? ";
		}
		api_util.addContext(contexts,'ask_service',5,{});
		return response.json(api_util.makeJsonResponse(reply,source,contexts));
	}
}
