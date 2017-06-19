
var homeController = require('../controller/home-controller.js');

module.exports = {
	setRoute : function (app) {
		
		app.get('/',function(req,res){
			homeController.getHome(req,res);
		});

		app.post('/query',function (req,res) {
			homeController.postQuery(req,res);
		});
	}
}

