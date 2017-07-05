
var mainController = require('../controller/main-controller.js');
var hookController = require('../controller/hook-controller.js');
module.exports = {
	setRoute : function (app) {
		
		app.get('/',function(req,res){
			mainController.getHome(req,res);
		});

		app.post('/query',function (req,res) {
			mainController.postQuery(req,res);
		});

		app.post('/hook',function (req,res) {
			hookController.hook(req,res,socket);
		});
	}
}

