var object = require('../model/object.js');
var api_util = require('../util/apiai-utils.js');
var db = require('../lib/db/dbHelper.js');
module.exports = {
	handle : function (action,req,res) {
		switch (action) {
			case 'service.user.want.send.money':
			chooseServiceSendMoney(req,res);
			break;
			case 'service.user.ask.balance':
			askBalance(req,res);
			break;
			case 'service.user.ask.history':
			askHistory(req,res);
			break;
		}		
	}
}

function chooseServiceSendMoney(request,response){
	var contexts = [];
	var reply = "Who do you want to send money to? Please type ONLY and EXACTLY full name";
	var source = ""	;
	api_util.removeContext(contexts,'ask_service');;
	api_util.addContext(contexts,'ask_name_to_send',3,{})
	api_util.addContext(contexts,'send_money',100,{});
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
},

function askBalance(request,response){
	var reply;
	var contexts = [];
	var source;
	var curAccount = api_util.getParamsOfContext(request,'authentication_pass').account_number;
	db.checkBalance(curAccount,function(success,data){
		if (!success){
			reply = "sorry, server is unavailable now. please try again later!";
		} else {
			reply = "You have "+data+" vnd now. What do you want to do next? ";
		}
		return response.json(api_util.makeJsonResponse(reply,source,contexts));
	});
}

function askHistory(request,response){
	var reply;
	var contexts = []
	var source;
	var curAccount = api_util.getParamsOfContext(request,'authentication_pass').account_number;
	db.getTradingHistory(curAccount,function (success,data){
		if (!success){
			reply = "sorry, server is unavailable now. please try again later";
		} else {
			reply = "Your transaction history: \n"+data;
		}
		return response.json(api_util.makeJsonResponse(reply,source,contexts));
	});
}