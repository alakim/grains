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
	
	function addInstance(cls, itm){
		for(var fc,i=0,c=cls.facets; fc=c[i],i<c.length; i++){
			if(fc.item===itm) return;
		}
		var fc = new cls.facetConstructor(itm);
		fc.item = itm;
		addFacet(itm, fc);
		cls.facets.push(fc);
	}
	
	function addFacet(itm, fc){
		if(!itm._aesopFacets) itm._aesopFacets = [];
		itm._aesopFacets.push(fc);
	}
	
	function removeInstance(cls, itm){
		var res = [];
		for(var fc,i=0,c=cls.facets; fc=c[i],i<c.length; i++){
			if(fc.item!==itm) res.push(fc);
			else removeFacet(itm, fc);
		}
		cls.facets = res;
	}
	
	function removeFacet(itm, fac){
		var res = [];
		for(var fc,c=itm._aesopFacets,i=0; fc=c[i],i<c.length; i++){
			if(fc!=fac) res.push(fc);
		}
		itm._aesopFacets = res;
	}
	
	return {
		version: "1.1",
		Class: Class,
		classify: function(itm){
			for(var nm in classIndex){var cls = classIndex[nm];
				if(cls.func(itm)) addInstance(cls, itm);
				else removeInstance(cls, itm);
			}
		},
		is: function(itm, classNm){
			var cls = classIndex[classNm];
			for(var el,i=0,c=cls.facets; el=c[i],i<c.length; i++){
				if(el===itm) return true;
			}
			return false;
		},
		getClass: function(name){return classIndex[name];},
		getClassNames: function(){
			var res = [];
			for(var nm in classIndex) res.push(nm);
			return res;
		},
		getInstancesCount: function(classNm){return classIndex[classNm].facets.length;}
	};
});