var JsPath = {
	version:"2.0.294"
};

(function(){
	function each(coll, F){
		if(typeof(coll.length)!="undefined")
			for(var i=0; i<coll.length; i++) F(coll[i], i, coll[i+1]);
		else
			for(var k in coll) F(coll[k], k);
	}
	
	function extend(o,s){for(var k in s) o[k] = s[k];}
	function getSteps(path){
		if(typeof(path)=="number") return path;
		
		if(path.constructor==Array){
			var res = [];
			each(path, function(s){
				var ss = getSteps(s);
				res = res.concat(ss);
			});
			return res;
		}
		if(typeof(path)=="string") return path.split("/");
		throw "Unknown path type";
	}
	function arrayMode(step){return typeof(step)=="number" || step.match(/^#(\d+)/);}
	
	extend(JsPath, {
		set: function(obj, path, val){
			var o = obj;
			var ss = getSteps(path);
			each(ss, function(s, i, next){
				var arrMode = arrayMode(s);
				var idx = arrMode?typeof(s)=="number"?s:parseInt(RegExp.$1):null;
				if(next==null){
					if(arrMode) o[idx] = val;
					else o[s] = val;
				}
				else{
					if(arrMode){
						if(typeof(o[idx])=="undefined")
							o[idx] = arrayMode(next)?[]:{};
						o = o[idx];
					}
					else{
						if(!o[s]) o[s] = arrayMode(next)?[]:{};
						o = o[s];
					}
				}
			});
			return obj;
		},
		
		get: function(obj, path){
			var o = obj;
			each(getSteps(path), function(s){
				if(arrayMode(s)){
					o = o[parseInt(RegExp.$1)];
				}
				else o = o[s];
			});
			return o;
		}
	});
})();
