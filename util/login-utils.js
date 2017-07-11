var api_util = require('../util/apiai-utils.js');
var db = require('../lib/db/dbHelper.js');
var object = require('../model/object.js');
var account;
module.exports = {
	handle : function (action,req,res){
		switch (action) {
			case 'login.welcome':
			welcome(req,res);
			break;
			case 'login.user.account':
			checkAccountNumber(req,res,false);
			break;
			case 'login.user.account.fallback':
			checkAccountNumber(req,res,true)
			break;
			case 'login.user.forget.account':
			forgetAccountNumber(req,res);
			break;
			case 'login.user.dontknow.account':
			dontKnowAccountNumber(req,res);
			break;
			case 'login.user.password':
			checkPassword(req,res);
			break;
			case 'login.user.dontknow.password':
			dontKnowPassword(req,res);
			break;
		}
	}
}

function dontKnowPassword(request,response){
	var name_context= 'ask_password';
	var lifespan = 0;
	var contexts = [];
	var reply = "For this case, please contact the XXX Service Desk at 312.984.3709 for assistance. This conversation session is over. If you have any further request, please tell me again.";
	var source = "end.session"	;
	contexts.push(new object.Context(name_context,lifespan,{}));
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}

function checkPassword(request,response){
	var password = request.body.result.parameters.password;
	var name_context = 'ask_password';
	var reply;
	var source;
	var contexts =[];
	var lifespan = api_util.getLifeSpanOfContext(request,name_context);

	//nếu đúng mật khẩu.
	if (String(password) == String(account.MATKHAU)){
		reply ="Hello "+account.TEN+", You have successfully logged in. What do you want now?";
		contexts.push(new object.Context('authentication_pass',200,{'account_number':account.SOTAIKHOAN,'name':account.HOTEN,'phone_number':account.SODIENTHOAI}));
		contexts.push(new object.Context('ask_service',5,{}));
		contexts.push(new object.Context(name_context,0,{}));
	}
	//sai mật khẩu
	else {
		reply ="Sorry! Your password is not correct, try again!";
		source ='ask.password';
		if (lifespan == 0){
			reply = "Your account has been blocked because you had wrong many times. Please contact the nearest bank if you need any assistance!"
			source = "end.session"
		}
		contexts.push(new object.Context(name_context,lifespan,{}));
	}
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}

function dontKnowAccountNumber(request,response){
	var name_context= 'ask_account_number';
	var lifespan = 0;
	var contexts = [];
	var reply = "It's a 9 digits number from your bank number which used for login. For example if your bank number is 000555222001 then your bank account number should be 000555222. Please enter yours so we can continue!";
	var source = ""	;
	//không tính sai khi người dùng hỏi account number là gì.
	lifespan = api_util.getLifeSpanOfContext(request,name_context);
	lifespan++;
	contexts.push(new object.Context(name_context,lifespan,{}));
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}

function forgetAccountNumber(request,response){
	var name_context = 'ask_account_number';
	var lifespan = 0;
	var contexts = [];
	var reply = 'For this case, please contact the XXX Service Desk at 312.984.3709 for assistance. This conversation session is over. If you have any further request, please tell me again.';
	var source = 'end.session';
	contexts.push(new object.Context(name_context,lifespan,{}));
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}

function checkAccountNumber(request,response,isFallback){
	var number;
	if (isFallback){
		number ='';
	} else {
		number = request.body.result.parameters.number;
	}
	db.getAccount(number,function (data){
		var name_context = 'ask_account_number'
		var lifespan
		var contexts = []
		var reply
		var source = ''
		//nếu nhập sai tài khoản
		if (data == null) {
			if (isFallback){
				reply = " Sorry I don't understand what you are saying.!"
			} else {
				reply = "Your bank account number is incorrect. Please check again!"
			}
			lifespan = api_util.getLifeSpanOfContext(request,name_context)
			//nhập sai quá nhiều
			if (lifespan == 0){
				reply = "You entered many wrong times. Please try again later."
				source = "end.session"
			}
		} 
		// nhập đúng tài khoản
		else {
			account = new object.Account(data);
			reply = "And what is your password? Please type ONLY and EXACTLY it";
			lifespan = 0;
			source = 'ask.password'
			contexts.push(new object.Context('ask_password',5,{}));
		}
		contexts.push(new object.Context(name_context,lifespan,{}))
		return response.json(api_util.makeJsonResponse(reply,source,contexts))
	})
}

function welcome(request,response){
	var contexts = []
	var reply = "Thank you for contacting XXX. What's your account number?"
	var source = ''
	api_util.removeAllContext(request,contexts);
	api_util.addContext(contexts,'ask_account_number',3,{});
	return response.json(api_util.makeJsonResponse(reply,source,contexts));
}