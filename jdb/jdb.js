var JDB = (function(){
	function lambda(str){
		if(!str) return;
		if(typeof(str)=="function") return str;
		if(str.indexOf("|")<0) return str;
		var arr = str.split("|");
		if(arr.length!=2) return str;
		return new Function(arr[0], "return "+arr[1]);
	}
	
	function each(coll, F){
		if(coll instanceof Array){
			for(var i=0,e; e=coll[i],i<coll.length; i++){
				F(e, i);
			}
		}
		else{
			var idx = 0;
			for(var k in coll) F(coll[k], k, idx++);
		}
	}
	
	function aggregate(coll, initial, F){
		F = lambda(F);
		var res = initial;
		each(coll, function(e){
			res = F(e, res);
		});
		return res;
	}
	
	function extend(o, s, deep){
		deep = deep || false;
		for(var k in s){
			var el = o[k];
			if(deep && typeof(el)=="object")
				extend(el, s[k]);
			else
				o[k] = s[k];
		}
	}
	
	function map(coll, F){
		F = lambda(F);
		var res;
		if(coll instanceof Array){
			res = [];
			each(coll, function(e, i){
				res.push(F(e, i, i));
			});
		}
		else{
			res = {};
			var idx = 0;
			each(coll, function(e, k){
				res[k] = (F(e, k, idx++));
			});
		}
		return res;
	}
	
	function select(coll, F){
		F = lambda(F);
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
		return res;
	}
	
	function first(coll, count){
		count = count || 1;
		var res = [];
		if(coll instanceof Array){
			for(var i=0; i<count && i<coll.length; i++){
				res.push(coll[i]);
			}
		}
		return res;
	}
	
	function flat(arr, F, recursive){
		//console.log("in: ", arr, F, recursive);
		if(typeof(arr)!="object") return arr;
		if(!F){
			var res = [];
			/*each(arr, function(e){
				var ee = flat(e);
				res = res.concat(ee);
			});*/
			for(var el,i=0; el=arr[i],i<arr.length; i++){
				res = res.concat(el);
			}
			return res;
		}
		var res = [];
		each(arr, function(el){
			el = F(el);
			//console.log("a: ", el);
			if(recursive) el = flat(el, F, true);
			else el = flat(el);
			//console.log("b: ", el);
			res = res.concat(el);
		});
		return res;
	}
	
	function page(coll, size, nr){
		if(nr<1) return [];
		var res = [],
		minIdx = size*(nr-1),
		maxIdx = size*nr;
		if(coll instanceof Array){
			for(var i=minIdx; i<maxIdx && i<coll.length; i++){
				res.push(coll[i]);
			}
		}
		return res;
	}
	
	function index(coll, F, Fobj){
		if(!F) F = function(x){return x;};
		F = lambda(F);
		Fobj = lambda(Fobj);
		var res;
		if(typeof(F)=="string"){
			res = {};
			each(coll, function(e, i){
				if(e) res[e[F]] = Fobj?Fobj(e, i):e;
			});
		}
		else{
			res = {};
			each(coll, function(e, i){
				if(e) res[F(e)] = Fobj?Fobj(e, i):e;
			});
		}
		return res;
	}
	
	function keys(obj){
		var res = [];
		for(var k in obj) res.push(k);
		return res;
	}
	
	function groupBy(coll, F){
		F = lambda(F);
		var res;
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
		return res;
	}
	
	function concat(coll, c2){
		if(typeof(c2.raw)=="function") c2 = c2.raw();
		res = [];
		each(coll, function(e){res.push(e);});
		each(c2, function(e){res.push(e);});
		return res;
	}
	
	function toArray(coll, F){
		F = lambda(F);
		if(coll instanceof Array) return coll;
		res = [];
		var mapMode = typeof(F)=="function";
		each(coll, function(e, k){
			res.push(mapMode?F(e, k):e);
		});
		return res;
	}
	
	function treeToArray(coll, childField, F){
		F = lambda(F);
		res = [];
		function tree(nd){
			var v = typeof(F)=="function"?F(nd):nd[F];
			res.push(v);
			each(nd[childField], tree);
		}
		tree(coll);
		return res;
	}
	
	function sort(coll, F){
		F = lambda(F);
		if(!F){
			return coll.sort();
		}
		else if(typeof(F)=="function"){
			return coll.sort(F);
		}
		else if(typeof(F)=="string"){
			return coll.sort(function(a,b){
				return a[F]>b[F]?1:a[F]<b[F]?-1:0;
			});
		}
	}
	
	function reverse(coll){
		var res = [];
		for(var i=coll.length-1; i>=0; i--){
			res.push(coll[i]);
		}
		return res;
	}
	
	function JDB(coll){
		if(!coll) coll = [];
		if(typeof(coll.raw)=="function") coll = coll.raw();
		var mon = (function(){
			return {
				raw: function(){return coll;},
				trace: function(msg){
					if(msg) console.log(msg, coll);
					else console.log(coll);
					return this;
				},
				map: function(F){return JDB(map(coll, F));},
				each: function(F){each(coll, F); return this;},
				aggregate: function(initial, F){return aggregate(coll, initial, F)},
				select: function(F){return JDB(select(coll, F));},
				first: function(count){return JDB(first(coll, count));},
				flat: function(){return JDB(flat(coll))},
				page: function(size, nr){return JDB(page(coll, size, nr));},
				index: function(F, Fobj){return JDB(index(coll, F, Fobj));},
				keys: function(){return JDB(keys(coll));},
				groupBy: function(F){return JDB(groupBy(coll, F));},
				extend: function(c2, deep){
					if(typeof(c2.raw)=="function") c2 = c2.raw();
					res = typeof(coll.raw)=="function"?coll.raw():coll;
					// each(coll, function(e,k){res[k] = e;});
					// each(c2, function(e, k){res[k] = e;});
					extend(res, c2, deep);
					return JDB(res);
				},
				concat: function(c2){return JDB(concat(coll, c2));},
				toArray: function(F){
					if(this.raw() instanceof Array) return this;
					return JDB(toArray(coll, F));
				},
				treeToArray: function(childField, F){return JDB(treeToArray(coll, childField, F));},
				sort: function(F){return JDB(sort(coll, F));},
				reverse: function(){
					return JDB(reverse(coll));
				}
			};
		})();
		return mon;
	}
	
	function Dictionary(){var _=this;
		var data = {};
		
		_.empty = function(){
			for(var k in data) return false;
			return true;
		};
		_.set = function(name, val){
			val = val || true;
			data[name] = val;
		}
		_.get = function(name){
			return data[name];
		}
		_.count = function(){
			var n = 0;
			for(var k in data) n++;
			return n;
		}
		_.data = function(){
			return data;
		}
	}
		
	function compareVersions(v1, v2){
		if(v1==v2) return 0;
		v1 = v1.split(".");
		v2 = v2.split(".");
		for(var i=0; i<3; i++){
			var a = parseInt(v1[i], 10),
				b = parseInt(v2[i], 10);
			
			if(a<b) return -1;
			if(a>b) return 1;
		}
		return 0;
	}
	
	function version(num){
		if(!num) return topVersion;
		for(var k in interfaces){
			if(compareVersions(num, k)<=0){
				var $D = function(x){return JDB(x);}
				extend($D, interfaces[k]);
				return $D;
			}
		}
		alert("JDB version "+num+" not supported");
	}
	
	var topVersion = "3.0.1"
	
	var intrf = {
		version: version,
		extend: extend,
		each: each,
		aggregate: aggregate,
		map: map,
		select: select,
		first: first,
		flat: flat,
		page: page,
		index: index,
		keys: keys,
		groupBy: groupBy,
		concat: concat,
		toArray: toArray,
		treeToArray: treeToArray,
		sort: sort,
		reverse: reverse,
		Dictionary: Dictionary
	};
	
	if(typeof(JSUnit)=="object") intrf.compareVersions = compareVersions;
	
	var interfaces = {};
	interfaces[topVersion] = intrf;
	
	extend(JDB, intrf);
	
	return JDB;
})();
