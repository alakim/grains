function Path(path){var _=this;
	_.file = null;
	if(path.constructor==Array)
		_.dirs = path;
	else if(typeof(path)=="object" && path.dirs){
		_.file = path.file;
		_.dirs = [];
		for(var i=0; i<path.dirs.length; i++){
			_.dirs.push(path.dirs[i]);
		}
	}
	else if(typeof(path)=="string"){
		_.dirs = [];
		var steps = path.split(/[\\\/]/);
		for(var i=0; i<steps.length; i++){
			var s = steps[i];
			if(s.match(/^[^\.\\\/]+(\.\w+)+$/i))
				_.file = s;
			else
				_.dirs.push(s);
		}
	}
	else
		_.dirs = [];
}

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	var __ = Path;
	
	extend(__, {
		version: "1.1.152",
		maxIterationCount:500
	});
	
	Path.prototype = {
		toDos: function(){var _=this;
			return _.dirs.join("\\")+(_.file?("\\"+_.file):"");
		},
		
		toWeb: function(){var _=this;
			return _.dirs.join("/")+(_.file?("/"+_.file):"");
		},
		
		relativeTo: function(basePath){var _=this;
			if(typeof(basePath)=="string")
				basePath = new Path(basePath);
			
			var backward = [];
			var forward = [];
				
			for(var i=0; i<__.maxIterationCount; i++){
				if(i>=_.dirs.length && i>=basePath.dirs.length)
					break;
				if(_.dirs[i]==basePath.dirs[i])
					continue;
				if(basePath.dirs.length>i)
					backward.push("../");
				if(_.dirs.length>i)
					forward.push(_.dirs[i]);
			}
			if(i>=__.maxIterationCount){
				throw "Too many iterations";
			}
			
			forward = forward.join("/");
			if(forward.length){
				forward = forward+"/";
			}
			
			return new Path(backward.join("")+forward+(_.file?_.file:""));
		},
		
		absoluteFrom: function(basePath){var _=this;
			if(typeof(basePath)=="string")
				basePath = new Path(basePath);
				
			var baseIdx = basePath.dirs.length;
			var forward = [];
			for(var i=0; i<_.dirs.length; i++){
				var d = _.dirs[i];
				if(d=="..")
					baseIdx--;
				else
					forward.push(d);
			}
			
			var base = [];
			for(var i=0; i<baseIdx; i++){
				base.push(basePath.dirs[i]);
			}
			base = base.join("/");
			forward = forward.join("/");
			if(forward.length && base.length)
				forward = "/"+forward;
			return new Path(base+forward+(_.file?("/"+_.file):""));
		}
	};
})()


