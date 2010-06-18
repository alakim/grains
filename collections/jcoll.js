var jColl = (function(){
	var _ = {
		version:"1.0.0",
		$C: function(coll){
			return {
				map:function(F){
					var res;
					if(coll instanceof Array){
						res = [];
						for(var i=0; i<coll.length; i++) res.push(F(coll[i], i));
					}
					else{
						res = {};
						for(var k in coll) res[k] = F(coll[k], k);
					}
					return _.$C(res);
				},
				
				filter: function(P){
					var res;
					if(coll instanceof Array){
						res = [];
						for(var i=0; i<coll.length; i++)
							if(P(coll[i], i))
								res.push(coll[i])
					}
					else{
						res = {};
						for(var k in coll)
							if(P(coll[k], k))
								res[k] = coll[k];
					}
					return _.$C(res);
				},
				
				find: function(P){
					if(coll instanceof Array){
						for(var i=0; i<coll.length; i++){var el = coll[i];
							if(P(el, i)) return _.$C(el);
						}
					}
					else{
						for(var k in coll){var el = coll[k];
							if(P(el, k)) return _.$C(el);
						}
					}
					return _.$C();
				},
				
				item:function(){
					return coll;
				}
			};
		}
	};
	
	return _;
})();
