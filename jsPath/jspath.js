var JsPath = {
	version:"1.0.203"
};

(function(){
	function each(coll, F){
		if(typeof(coll.length)!="undefined")
			for(var i=0; i<coll.length; i++) F(coll[i], i, coll[i+1]);
		else
			for(var k in coll) F(coll[k], k);
	}
	
	function extend(o,s){
		for(var k in s) o[k] = s[k];
	}
	
	var _=JsPath;
	
	function getSteps(path){
		return path.split("/");
	}
	
	function arrayMode(step){
		return step.match(/^#(\d+)/);
	}
	
	extend(_, {
		set: function(obj, path, val){
			var o = obj;
			each(getSteps(path), function(s, i, next){
				var arrMode = arrayMode(s);
				var idx = arrMode?RegExp.$1:null;
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
			each(getSteps(path), function(s){o = o[s];});
			return o;
		}
	});
	
	if(typeof(JSUnit)!="undefined"){
		_.privates = {
			getSteps:getSteps
		}
	}
})();
