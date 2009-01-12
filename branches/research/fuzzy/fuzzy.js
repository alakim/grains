var Fuzzy = {};

(function(){
	function extend(o,s){for(var k in s)o[k] = s[k];}
	
	var _ = Fuzzy;
	extend(_, {
		version: "1.3.54",
		
		and: function(x, y){
			return Math.min(_.truth(x),_.truth(y));
		},
		
		or: function(x, y){
			return Math.max(_.truth(x),_.truth(y));
		},
		
		not: function(x){
			return 1 - _.truth(x);
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
			},
			L: function(xTop, dL, dR){
				return function(x){
					return x<xTop-dL? 0
						:x>xTop+dR? 0
						:x==xTop? 1
						:x<xTop? (x - (xTop-dL))/dL
						:(x-(xTop+dR))/-dR;
				};
			},
			P: function(vMin, vMax, dL, dR){
				dL = dL==null?0:dL;
				dR = dR==null?0:dR;
				return function(x){
					return x<vMin-dL? 0
						:x>vMax+dR? 0
						:x>=vMin && x<=vMax? 1
						:x<vMin? (x-(vMin-dL))/dL
						:(x-(vMax+dR))/-dR;
				};
			}
		},
		
		defuzzy: function(xMin, xMax, F){
			var count = 100;
			var points = 0;
			var step = (xMax - xMin)/count;
			var S = 0;
			for(var p = xMin; p<=xMax; p+=step){
				points+=F(p);
				S+=F(p)*p;
			}
			return S/points;
		},
		
		truth: function(x){
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