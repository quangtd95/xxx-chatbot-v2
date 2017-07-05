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
			case  'service.user.which.service.fallback':
			fallBack(req,res);
			break;
			case 'service.user.want.sign.out':
			signOut(req,res);
			break;
		}		
	}
}

function signOut(request,response){
	var reply = 'good bye';
	var contexts = [];
	var source = 'end.session';
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}

function fallBack(request,response){
	var reply;
	var contexts = [];
	var source;
	var lifespan = api_util.getLifeSpanOfContext(request,'ask_service');
	if ((lifespan == 0)){		
		reply = "Your transaction has been cancel. Please type conrrectly service you want to use in next time!\n what would you like to do?"
		source = "end.session";
		api_util.removeContext(contexts,'ask_service');
		api_util.removeContext(contexts,'authentication_pass');
	}
	else {
		reply = "I can help you check your balance, your trading history or sending your money";
	}
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}

function chooseServiceSendMoney(request,response){
	var contexts = [];
	var reply = "Who do you want to send money to? Please type ONLY and EXACTLY full name";
	var source = ""	;
	api_util.removeContext(contexts,'ask_service');;
	api_util.addContext(contexts,'ask_name_to_send',3,{})
	api_util.addContext(contexts,'send_money',100,{});
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}

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
			reply = data;
		}
		return response.json(api_util.makeJsonResponse(reply,source,contexts));
	});
}