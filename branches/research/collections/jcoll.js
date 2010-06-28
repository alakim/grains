var jColl = (function(){
	function lambda(F){
		if(typeof(F)=="string"){
			var a = F.split("|");
			F = new Function(a[0], "return "+a[1])
		};
		return F;
	}
	
	function extend(o,s){for(var k in s)o[k] = s[k];}
	
	function Mon(coll){
		extend(this, {
			map:function(F){
				F = lambda(F);
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
			
			toList: function(F){
				F = lambda(F);
				var res = [];
				for(var k in coll) res.push(F(coll[k], k));
				return _.$C(res);
			},
			
			toDict: function(keyF, valF){
				keyF = lambda(keyF);
				valF = lambda(valF);
				var res = {};
				for(var i=0; i<coll.length; i++){var e = coll[i];
					res[keyF(e,i)] = valF(e,i);
				}
				return _.$C(res);
			},
			
			path: function(p){
				var steps = p.split("/");
				var r = coll;
				for(var i=0; r!=null&&i<steps.length; i++){
					r = r[steps[i]];
				}
				return _.$C(r);
			},
			
			first: function(){
				return _.$C(coll[0]);
			},
			
			last: function(){
				return _.$C(coll[coll.length-1]);
			},
			
			filter: function(P){
				P = lambda(P);
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
				P = lambda(P);
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
			
			join: function(coll2, F){
				F = lambda(F);
				var r = [];
				for(var k in coll){
					var e1 = coll[k];
					for(var m in coll2.item()){
						var e2 = coll2.item()[m];
						var e = F(e1, e2);
						if(e)
							r.push(e);
					}
				}
				return _.$C(r)
			},
			
			item:function(){
				return coll;
			}
		});
	}
	
	var _ = {
		version:"1.0.0",
		$C: function(coll){
			return coll instanceof Mon?coll:new Mon(coll);
		}
	};
	
	return _;
})();
