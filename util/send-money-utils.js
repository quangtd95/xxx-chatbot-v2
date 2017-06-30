var api_util = require('../util/apiai-utils.js');
var db = require('../lib/db/dbHelper.js');
var object = require('../model/object.js');
var otp = require('../lib/otp/otp.js');

module.exports = {
	handle: function (action,req,res,account,socket){
		switch(action){
			case 'sendmoney.user.name':
			case 'sendmoney.user.name.fallback':
			checkName(req,res);
			break;
			case 'sendmoney.user.account':
			checkAccountNumber(req,res,false);
			break;
			case 'sendmoney.user.account.fallback':
			checkAccountNumber(req,res,true);
			break;
			case 'sendmoney.user.money':
			checkMoney(req,res,false,socket);
			break;
			case 'sendmoney.user.money.fallback':
			checkMoney(req,res,true,socket);
			break;
			case 'sendmoney.user.code':
			checkCode(req,res,false);
			break;
			case 'sendmoney.user.code.fallback':
			checkCode(req,res,true);
			break;

		}
	}
}

function checkCode(request,response,isFallback){
	var codeTrue = api_util.getParamsOfContext(request,'ask_verify_code').code;
	var code;
	var reply;
	var contexts =[];
	var source;
	var lifespan = api_util.getLifeSpanOfContext(request,'ask_verify_code');

	console.log("code dung: "+codeTrue);
	if (isFallback) {
		if (request.body.result.resolvedQuery.toLowerCase() == 'cancel'){
			code = 'cancel';
		} else {
			code = '';
			reply = 'I dont\' understand what are you saying';
		}
	} else {
		code = request.body.result.parameters.number;
		reply = ""
		//nhaapj ddung code
		if (code == codeTrue){
			reply = "correctly. Are you sure you want to send?";
			api_util.removeContext(contexts,'ask_verify_code');
			api_util.addContext(contexts,'ask_confirm',3,{});
		}
		//nhap sai
		else {
			reply = "sorry, the code you have typen is not correct. Please try again";
		}
	}
	console.log("code nhap vao: "+ code);
	if ((lifespan == 0) || (number.toLowerCase() == 'cancel')){
		if (lifespan == 0 ) {
			reply = "Your transaction has been cancel. Please type conrrectly verify code in next time!\n what would you like to do?"
		}
		else {
			reply = "Your transaction has been cancel. What would you like to do?"
		}
		source = ""
		api_util.removeContext(contexts,'ask_verify_code');
		api_util.removeContext(contexts,'send_money');
		api_util.addContext(contexts,'ask_service',3,{});
	}
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}



function checkMoney (request,response,isFallback,socket) {
	var number;
	var reply;
	var contexts = [];
	var source ;
	var lifespan = api_util.getLifeSpanOfContext(request,'ask_money_to_send');
	if (isFallback){
		if (request.body.result.resolvedQuery.toLowerCase() == 'cancel'){
			number = 'cancel';
		} else {
			number = '';
			reply = 'please type again how much you want to send!'
		}
	} else {
		number = request.body.result.parameters.number;
		reply = "we just have given you a code in sms. plese type it: ";
		api_util.removeContext(contexts,'ask_money_to_send');
		var code =  Math.floor(Math.random() * (9999- 1000) + 1000);
		api_util.addContext(contexts,'ask_verify_code',3,{code:code});
		otp.sendSms('+841264793929'," Your verify code is "+code);
		
		setTimeout(function() {
			console.log("socket run");
			if (socket != null){
				socket.emit('timeout','sorry, you must enter correctly veryfy code to continue');
			}
		}, 30000);

	}

	if ((lifespan == 0) || (number.toLowerCase() == 'cancel')){
		if (lifespan == 0 ) {
			reply = "Your transaction has been cancel. Please type conrrectly account number of whom you want to send money in next time!\n what would you like to do?"
		}
		else {
			reply = "Your transaction has been cancel. What would you like to do?"
		}
		source = ""
		api_util.removeContext(contexts,'ask_money_to_send');
		api_util.removeContext(contexts,'send_money');
		api_util.addContext(contexts,'ask_service',3,{});
	}
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}
function checkAccountNumber(request,response,isFallback){
	var params = api_util.getParamsOfContext(request,'send_money');
	var currentAccountNumber = api_util.getParamsOfContext(request,'authentication_pass').account_number;
	var name = params.name;
	var reply;
	var contexts = []
	var source;
	var number;
	if (isFallback) {
		if (request.body.result.resolvedQuery.toLowerCase() == 'cancel') number = 'cancel'
			else number = '';
	}
	else {
		number = request.body.result.parameters.number;	
	}

	db.getAccount(number,function(data){
		//tài khoản không tồn tại 
		if ( (data == null )){
			reply = "bank account number is incorrect!! please type again.";
			var lifespan = api_util.getLifeSpanOfContext(request,'ask_account_number_to_send');
			if ((lifespan == 0) || (number.toLowerCase() == 'cancel')){
				if (lifespan == 0 ) {
					reply = "Your transaction has been cancel. Please type conrrectly account number of whom you want to send money in next time!\n what would you like to do?"
				}
				else {
					reply = "Your transaction has been cancel. What would you like to do?"
				}
				source = ""
				api_util.removeContext(contexts,'ask_account_number_to_send');
				api_util.removeContext(contexts,'send_money');
				api_util.addContext(contexts,'ask_service',3,{});
			}
			return response.json(api_util.makeJsonResponse(reply,source,contexts));
			//tài khoản ko khớp với tên
		} else if (data.HOTEN != name){
			reply = "name and account number are not match!! please type again.";
			var lifespan = api_util.getLifeSpanOfContext(request,'ask_account_number_to_send');
			if ((lifespan == 0) || (number.toLowerCase() == 'cancel')){
				if (lifespan == 0 ) {
					reply = "Your transaction has been cancel. Please type conrrectly account number of whom you want to send money in next time!\n what would you like to do?"
				}
				else {
					reply = "Your transaction has been cancel. What would you like to do?"
				}
				source = ""
				api_util.removeContext(contexts,'ask_account_number_to_send');
				api_util.removeContext(contexts,'send_money');
				api_util.addContext(contexts,'ask_service',3,{});
			}
			return response.json(api_util.makeJsonResponse(reply,source,contexts));
			//tài khoản gửi trùng tài khoản nhận
		} else if (data.SOTAIKHOAN == currentAccountNumber){
			reply = "sorry, you cannot send money to you. Your transaction has been canceled.";
			var lifespan = api_util.getLifeSpanOfContext(request,'ask_account_number_to_send');
			if ((lifespan == 0) || (number.toLowerCase() == 'cancel')){
				if (lifespan == 0 ) {
					reply = "Your transaction has been cancel. Please type conrrectly account number of whom you want to send money in next time!\n what would you like to do?"
				}
				else {
					reply = "Your transaction has been cancel. What would you like to do?"
				}
				source = ""
			}
			api_util.removeContext(contexts,'ask_account_number_to_send');
			api_util.removeContext(contexts,'send_money');
			api_util.addContext(contexts,'ask_service',3,{});
			return response.json(api_util.makeJsonResponse(reply,source,contexts));
		}
		reply = "how much do you want to send?";
		api_util.removeContext(contexts,'ask_account_number_to_send');
		api_util.addContext(contexts,'ask_money_to_send',3,{});
		return response.json(api_util.makeJsonResponse(reply,source,contexts));

	});

}


function checkName(request, response){
	var name = String(request.body.result.resolvedQuery);
	var reply;
	var contexts = [];
	var source ='';
	db.findName(name,function(isTrue){

		//nếu tên người nhận có tồn tại trong database.
		if (isTrue){
			reply = "So, What is the bank account number of "+ name+" ?";
			api_util.removeContext(contexts,'ask_name_to_send');
			api_util.addContext(contexts,'ask_account_number_to_send',3,{});
			api_util.addContext(contexts,'send_money',3,{'name':name});


		} else {
			reply = "Sorry, the name you have just entered is incorrect!.Please try again";
			var lifespan = api_util.getLifeSpanOfContext(request,'ask_name_to_send');

			//nếu sai quá 3 lần hoặc người dùng gõ CANCEL thì hủy giao dịch.
			if ((lifespan == 0) || (name.toLowerCase() == 'cancel')){
				if (lifespan == 0 ) {
					reply = "Your transaction has been cancel. Please type conrrectly name whom you want to send money in next time!\n what would you like to do?"
				}
				else {
					reply = "Your transaction has been cancel. What would you like to do?"
				}
				source = ""
				api_util.removeContext(contexts,'ask_name_to_send');
				api_util.removeContext(contexts,'send_money');
				api_util.addContext(contexts,'ask_service',3,{});
			}
		}


		return response.json(api_util.makeJsonResponse(reply,source,contexts));
	});
}
