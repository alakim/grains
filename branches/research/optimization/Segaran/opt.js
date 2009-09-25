var Opt = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	function each(coll, F){
		if(!coll) return;
		for(var i=0; i<coll.length; i++)
			F(coll[i], i);
	}

	function randInt(minV, maxV){
		var r = Math.random();
		return Math.round(r*(maxV - minV)+minV);
	}

	if(typeof(JSUnit)!="undefined"){
		extend(Opt, {
			randInt:randInt
		});
	}
	
	extend(Opt, {
		version: "1.0.0",

		randomoptimize: function(dmn, costf){
			var count = 10000;
			var best = Math.max;
			var bestr = null;
			for(var i=0; i<count; i++){
				var r = [];
				for(var j=0; j<dmn.length; j++){
					r.push(randInt(dmn[j].minV, dmn[j].maxV));
				}
				var cost = costf(r);
				if(cost<best){
					best = cost;
					bestr = r;
				}
			}
			return r;
		},
		
		hillclimb: function(dmn, costf){
			
		}
	});
	
})();