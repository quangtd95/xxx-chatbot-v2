var object = require('../model/object.js');
module.exports = {
	getLifeSpanOfContext : function (request,name_context) {
		var contexts = request.body.result.contexts;
		for (var i = 0 ; i < contexts.length;i++){
			if (contexts[i].name ==  name_context){
				return contexts[i].lifespan;
			}
		}
		return 0;
	},
	getParamsOfContext: function (request,name_context){
		var contexts = request.body.result.contexts;
		for (var i = 0; i < contexts.length;i++){
			if (contexts[i].name == name_context){
				return contexts[i].parameters;
			}
		}
		return null;
	},
	makeJsonResponse: function (reply,source,contexts){
		var json = {
			speech:reply,
			displayText:reply,
			source:source,
			contextOut:contexts
		}
		return json;
	},
	addContext: function(contexts,name_context,lifespan,params){
		contexts.push(new object.Context(name_context,lifespan,params));
	},
	removeContext : removeContext = function (contexts,name_context){
		contexts.push(new object.Context(name_context,0,{}));
	},
	removeAllContext: function (request,contexts){
		var currentContexts = request.body.result.contexts;
		for (var i = 0 ; i < currentContexts.length; i++){
			removeContext(contexts,currentContexts[i].name);
		}
	}
}


