var Property = {
	create: function(defaultValue){
		var val = defaultValue;
		
		return function(v){
			if(v) val = v;
			else return val;
		};
	}
}
