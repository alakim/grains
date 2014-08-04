define([], function(){
	var facets = {};
	
	function extend(obj, ext){
		for(var k in ext) obj[k] = ext[k];
	}
	
	function Facet(name, func){var _=this;
		_.name = name;
		_.func = func;
		_.instances = [];
		facets[name] = _;
	}
	
	extend(Facet.prototype, {
		each: function(act){var _=this;
			for(var itm,i=0; itm=_.instances[i],i<_.instances.length; i++){
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
	
	function addInstance(fc, inst){
		for(var itm,i=0; itm=fc.instances[i],i<fc.instances.length; i++){
			if(itm===inst) return;
		}
		fc.instances.push(inst);
	}
	
	function removeInstance(fc, inst){
		var res = [];
		for(var itm,i=0; itm=fc.instances[i],i<fc.instances.length; i++){
			if(itm!==inst) res.push(itm);
		}
		fc.instances = res;
	}
	
	return {
		version: "1.0",
		Facet: Facet,
		classify: function(itm){
			for(var nm in facets){var fc = facets[nm];
				if(fc.func(itm)) addInstance(fc, itm);
				else removeInstance(fc, itm);
			}
		},
		getFacet: function(name){return facets[name];},
		getFacetNames: function(){
			var res = [];
			for(var nm in facets) res.push(nm);
			return res;
		},
		getInstancesCount: function(facetNm){return facets[facetNm].instances.length;}
	};
});