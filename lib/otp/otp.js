const Nexmo = require('nexmo');
const nexmo = new Nexmo({
	apiKey: "8ed79a41",
	apiSecret: "851fa93f9021e9bb",
}, {debug: true});

module.exports = {
	sendSms:function (toNumber,text){
		nexmo.message.sendSms("841264793929",toNumber,text,{type:'unicode'},
			(err,responseData) => {
				if (err){
					console.log(err);
				} else {
					console.dir(responseData);
				}
			});
	}
}