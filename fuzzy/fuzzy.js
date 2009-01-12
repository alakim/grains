var Fuzzy = {};

(function(){
	function extend(o,s){for(var k in s)o[k] = s[k];}
	
	var _ = Fuzzy;
	extend(_, {
		version: "1.0.51",
		
		and: function(x, y){
			return Math.min(_.getFuzzyValue(x),_.getFuzzyValue(y));
		},
		
		or: function(x, y){
			return Math.max(_.getFuzzyValue(x),_.getFuzzyValue(y));
		},
		
		getFuzzyValue: function(x){
			if(x==true)
				return 1.0;
			if(x==false)
				return 0;
			if(typeof(x)=="string")
				return parseFloat(x);
			return x;
		}
	});
})();