define([], function(){
	var classIndex = {};
	
	function extend(obj, ext){
		for(var k in ext) obj[k] = ext[k];
	}
	
	function Class(name, func, facetConstructor){var _=this;
		_.name = name;
		_.func = func;
		_.facets = [];
		_.facetConstructor = facetConstructor || function(){};
		classIndex[name] = _;
	}
	
	extend(Class.prototype, {
		each: function(act){var _=this;
			for(var itm,i=0,c=_.facets; itm=c[i],i<c.length; i++){
				act(itm);
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
		for(var fc,i=0,c=cls.facets; fc=c[i],i<c.length; i++){
			if(fc.item===itm) return;
		}
		var fc = new cls.facetConstructor(itm);
		fc.item = itm;
		if(facetData) extend(fc, facetData);
		cls.facets.push(fc);
	}
	
	function removeInstance(cls, itm){
		var res = [];
		for(var fc,i=0,c=cls.facets; fc=c[i],i<c.length; i++){
			if(fc.item!==itm) res.push(fc);
		}
		cls.facets = res;
	}
	
	function getFacet(itm, classOrName){
		var cls = typeof(classOrName)=="string"?classIndex[classOrName]:classOrName;
		if(!cls) alert("Class "+classNm+" does not exist!");
		for(var fc,i=0,c=cls.facets; fc=c[i],i<c.length; i++){
			if(fc.item===itm) return fc;
		}
		return false;
	}
	
	return {
		version: "2.0",
		Class: Class,
		classify: function(itm, className, facetData){
			if(!className){
				for(var nm in classIndex){var cls = classIndex[nm];
					if(getFacet(itm, cls)) continue;
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
		getInstancesCount: function(classNm){return classIndex[classNm].facets.length;}
	};
});