var JsPath = {
	version:"4.2.541"
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
		if(path==null) throw "Path or step of path is null";
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
	function arrayMode(step){return typeof(step)=="number" || step.match(/^#(\d+)|(\*)/);}
	
	function pathToString(path){
		var sPath = getSteps(path);
		return sPath instanceof Array? sPath.join("/")
			:sPath.toString();
	}
	
	function pathMatch(p1, p2){
		p1 = getSteps(p1);
		p2 = getSteps(p2);
		for(var i=0; i<p1.length && i<p2.length; i++){
			if(p1[i]=="*") continue;
			if(p2[i]=="*") continue;
			if(p1[i]!=p2[i]) return false;
		}
		return true;
	}
	
	var handlers = {
		onchange:[],
		onmove:[],
		onremove:[]
	};
	
	extend(JsPath, {
		set: function(obj, path, val){
			if(path==null) throw "Path is null";
			var o = obj;
			var ss = getSteps(path);
			each(ss, function(s, i, next){
				if(s==null) throw "Step is null";
				else{
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
						if(next=="#*"){
							o.push(val);
						}
					}
				}
			});
			each(handlers.onchange, function(hnd){
				if(pathMatch(path, hnd.path))
					hnd.handler(obj, path, val);
			});
			return obj;
		},
		
		get: function(obj, path){
			if(path==null) throw "Path is null";
			var o = obj;
			if(o==null) return null;
			each(getSteps(path), function(s){
				if(s==null) throw "Step is null";
				if(o==null) return;
				if(arrayMode(s)){
					o = o[parseInt(RegExp.$1)];
				}
				else o = o[s];
			});
			return o;
		},
		
		delItem: function(obj, path){with(JsPath){
			var elPath = getSteps(path);
			var collPath = elPath.splice(0, elPath.length-1);
			elPath = elPath.join("");
			var coll = get(obj, collPath);
			if(coll instanceof Array)
				coll.splice(parseInt(elPath.match(/\d+/)),1);
			else{
				var newC = {};
				for(var k in coll){
					if(k!=elPath) newC[k] = coll[k];
				}
				set(obj, collPath, newC);
			}
			each(handlers.onremove, function(hnd){
				if(pathMatch(path, hnd.path))
					hnd.handler(obj, path);
			});
		}},
		
		push: function(obj, path, val){
			var arr = JsPath.get(obj, path);
			if(!arr || !(arr instanceof Array)){
				arr = [];
				JsPath.set(obj, path, arr);
			}
			arr.push(val);
		},
		
		remove: function(obj, path){JsPath.delItem(obj, path);},
		
		move: function(obj, path, up){with(JsPath){
			var elPath = getSteps(path);
			var collPath = elPath.splice(0, elPath.length-1);
			elPath = elPath.join("");
			var coll = get(obj, collPath);
			if(coll instanceof Array){
				var idx = parseInt(elPath.match(/\d+/));
				if(idx==0 && up) throw "Can't move first element up.";
				if(idx==coll.length-1 && !up) throw "Can't move last element down.";
				var el = coll[idx];
				coll.splice(idx,1);
				coll.splice(up?idx-1:idx+1, 0, el);
				
				each(handlers.onmove, function(hnd){
					if(pathMatch(path, hnd.path))
						hnd.handler(obj, path, up);
				});
			}
			else
				throw "Moving object attribute is meaningless";
		}},
		
		moveUp: function(obj, path){JsPath.move(obj, path, true);},
		moveDown: function(obj, path){JsPath.move(obj, path, false);},
		onchange:{
			bind: function(path, handler){
				handlers.onchange.push({path:pathToString(path), handler:handler});
				return handlers.onchange.length - 1;
			},
			reset: function(){handlers.onchange = [];},
			unbind: function(idx){handlers.onchange.splice(idx, 1);}
		},
		onmove:{
			bind: function(path, handler){
				handlers.onmove.push({path:pathToString(path), handler:handler});
				return handlers.onmove.length - 1;
			},
			reset: function(){handlers.onmove = [];},
			unbind: function(idx){handlers.onmove.splice(idx, 1);}
		},
		onremove:{
			bind: function(path, handler){
				handlers.onremove.push({path:pathToString(path), handler:handler});
				return handlers.onremove.length - 1;
			},
			reset: function(){handlers.onremove = [];},
			unbind: function(idx){handlers.onremove.splice(idx, 1);}
		}
	});
})();
