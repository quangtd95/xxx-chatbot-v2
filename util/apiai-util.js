module.exports = {
	getLifeSpanOfContext : function (request,name_context) {
		var contexts = request.body.result.contexts;
		for (var i = 0 ; i < contexts.length;i++){
			console.log(contexts[i].name+" va "+name_context);
			if (contexts[i].name ==  name_context){
				return contexts[i].lifespan;
			}
		}
		return 0;
	}
}