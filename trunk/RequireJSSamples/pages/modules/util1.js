define(["log"], function(log){
	log.write("util1 loaded!");
	return {
		add: function(x, y){return x+y},
		mul: function(x, y){return x*y}
	};
});