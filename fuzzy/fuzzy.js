var Fuzzy = {};

(function(){
	function extend(o,s){for(var k in s)o[k] = s[k];}
	
	var _ = Fuzzy;
	extend(_, {
		version: "1.2.53",
		
		and: function(x, y){
			return Math.min(_.getFuzzyValue(x),_.getFuzzyValue(y));
		},
		
		or: function(x, y){
			return Math.max(_.getFuzzyValue(x),_.getFuzzyValue(y));
		},
		
		not: function(x){
			return 1 - _.getFuzzyValue(x);
		},
		
		functions: {
			S: function(vMin, vMax){
				return function(x){
					return x>vMax? 1
						:x<vMin? 0
						:(x - vMin)/(vMax - vMin);
				};
			},
			Z: function(vMin, vMax){
				return function(x){
					return x>vMax? 0
						:x<vMin? 1
						:(x-vMax)/-(vMax - vMin);
				};
			}
		},
		
		defuzzy: function(xMin, xMax, F){
			var count = 100;
			var points = 0;
			var step = (xMax - xMin)/count;
			var S = 0;
			for(var p = xMin; p<=xMax; p+=step){
				var val = F(p);
				if(val>0){
					points++;
					S+=val*p;
				}
			}
			return S/count + xMin;
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