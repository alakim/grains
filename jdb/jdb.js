var JDB = (function(){
	function each(coll, F){
		if(coll instanceof Array){
			for(var i=0,e; e=coll[i],i<coll.length; i++){
				F(e, i);
			}
		}
		else{
			for(var k in coll) F(coll[k], k);
		}
	}
	
	function JDB(coll){
		var mon = (function(){
			return {
				raw: function(){return coll;},
				map: function(F){
					var res;
					if(coll instanceof Array){
						res = [];
						each(coll, function(e, i){
							res.push(F(e, i));
						});
					}
					else{
						res = {};
						each(coll, function(e, k){
							res[k] = (F(e, k));
						});
					}
					return JDB(res);
				},
				each: function(F){
					each(coll, F);
					return this;
				},
				select: function(F){
					var res;
					if(coll instanceof Array){
						res = [];
						each(coll, function(e, i){
							if(F(e, i)) res.push(e);
						});
					}
					else{
						res = {};
						each(coll, function(e, k){
							if(F(e, k)) res[k] = e;
						});
					}
					return JDB(res);
				}
			};
		})();
		return mon;
	}
	
	JDB.version = "1.0.0";
	return JDB;
})();