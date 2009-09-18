var Property = {
	create: function(defaultValue, getter, setter){
		var val = defaultValue;
		
		return function(v){
			if(v){
				if(setter) setter(v);
				else val = v;
			}
			else{
				if(getter) return getter();
				else return val;
			}
		};
	}
}
