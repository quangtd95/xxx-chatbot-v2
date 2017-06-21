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
	makeJsonResponse: function (reply,source,contexts){
		var json = {
			speech:reply,
			displayText:reply,
			source:source,
			contextOut:contexts
		}
		return json;
	}
}
