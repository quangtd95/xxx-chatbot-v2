const Nexmo = require('nexmo');
const nexmo = new Nexmo({
	apiKey: "204919db",
	apiSecret: "8d3e7906e612cb15",
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