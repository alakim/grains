define([], function(){
	var classIndex = {};
	
	function extend(obj, ext){
		for(var k in ext) obj[k] = ext[k];
	}
	
	function Class(name, func, facetConstructor){var _=this;
		_.name = name;
		_.func = func;
		_.facets = {};
		_.facetConstructor = facetConstructor || function(){};
		classIndex[name] = _;
	}
	
	extend(Class.prototype, {
		each: function(act){var _=this;
			var c = _.facets;
			for(var id in c){
				var el = c[id];
				if(el) act(el);
			}
		},
		map: function(F){
			var res = [];
			this.each(function(itm){res.push(F?F(itm):itm);});
			return res;
		},
		getAll: function(){
			return this.map();
		}
	});
	
	function addInstance(cls, itm, facetData){
		if(cls.facets[itm.__aesopID]) return;
		var fc = new cls.facetConstructor(itm);
		fc.item = itm;
		if(facetData) extend(fc, facetData);
		cls.facets[itm.__aesopID] = fc;
	}
	
	function removeInstance(cls, itm){
		cls.facets[itm.__aesopID] = null;
	}
	
	function getFacet(itm, classOrName){
		if(!classOrName) alert("Class "+classOrName+" does not exist!");
		var cls = typeof(classOrName)=="string"?classIndex[classOrName]:classOrName;
		return cls.facets[itm.__aesopID];
	}
	
	var newID = (function(){
		var idx = 0;
		return function(){
			return ++idx;
		};
	})();
	
	return {
		version: "2.2",
		Class: Class,
		classify: function(itm, className, facetData){
			if(!itm.__aesopID) itm.__aesopID = newID();
			if(!className){				for(var nm in classIndex){var cls = classIndex[nm];
					if(!cls.func) continue;
					if(cls.func(itm)) addInstance(cls, itm);
					else removeInstance(cls, itm);
				}
			}
			else{
				var cls = classIndex[className];
				addInstance(cls, itm, facetData);
			}
		},
		declassify: function(itm, className){
			var cls = classIndex[className];
			removeInstance(cls, itm);
		},
		getFacet: getFacet,
		getClass: function(name){return classIndex[name];},
		getClassNames: function(){
			var res = [];
			for(var nm in classIndex) res.push(nm);
			return res;
		},
		getInstancesCount: function(classNm){
			var res = 0, c = classIndex[classNm].facets;
			for(var k in c) if(c[k]) res++;
			return res;
		}
	};
});