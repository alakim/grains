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
	
	function extend(o, s){
		for(var k in s) o[k] = s[k];
	}
	
	function JDB(coll){
		if(typeof(coll.raw)=="function") coll = coll.raw();
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
				},
				index: function(F){
					if(typeof(F)=="string"){
						res = {};
						each(coll, function(e){
							if(e) res[e[F]] = e;
						});
					}
					else{
						res = {};
						each(coll, function(e){
							if(e) res[F(e)] = e;
						});
					}
					return JDB(res);
				},
				groupBy: function(F){
					if(typeof(F)=="string"){
						res = {};
						each(coll, function(e){
							if(!e) return;
							var k = e[F];
							if(!res[k]) res[k] = [];
							res[k].push(e);
						});
					}
					else{
						res = {};
						each(coll, function(e){
							if(!e) return;
							var k = F(e);
							if(!res[k]) res[k] = [];
							res[k].push(e);
						})
					}
					return JDB(res); 
				},
				extend: function(c2){
					if(typeof(c2.raw)=="function") c2 = c2.raw();
					res = {};
					each(coll, function(e,k){res[k] = e;});
					each(c2, function(e, k){res[k] = e;});
					return JDB(res);
				},
				concat: function(c2){
					if(typeof(c2.raw)=="function") c2 = c2.raw();
					res = [];
					each(coll, function(e){res.push(e);});
					each(c2, function(e){res.push(e);});
					return JDB(res);
				},
				toArray: function(F){
					if(this.raw() instanceof Array) return this;
					res = [];
					var mapMode = typeof(F)=="function";
					each(coll, function(e, k){
						res.push(mapMode?F(e, k):e);
					});
					return JDB(res);
				},
				treeToArray: function(childField, F){
					res = [];
					function tree(nd){
						var v = typeof(F)=="function"?F(nd):nd[F];
						res.push(v);
						each(nd[childField], tree);
					}
					tree(coll);
					return JDB(res);
				},
				sort: function(F){
					if(!F){
						return JDB(coll.sort());
					}
					else if(typeof(F)=="function"){
						return JDB(coll.sort(F));
					}
					else if(typeof(F)=="string"){
						return JDB(coll.sort(function(a,b){
							return a[F]>b[F]?1:a[F]<b[F]?-1:0;
						}));
					}
				},
				reverse: function(){
					var res = [];
					for(var i=coll.length-1; i>=0; i--){
						res.push(coll[i]);
					}
					return JDB(res);
				}
			};
		})();
		return mon;
	}
	extend(JDB, {
		version: "1.0.0",
		extend: extend,
		each: each
	});
	return JDB;
})();