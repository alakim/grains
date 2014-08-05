define([], function(){
	var classIndex = {};
	
	function extend(obj, ext){
		for(var k in ext) obj[k] = ext[k];
	}
	
	function Class(name, func){var _=this;
		_.name = name;
		_.func = func;
		_.instances = [];
		classIndex[name] = _;
	}
	
	extend(Class.prototype, {
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
	
	function addInstance(cls, inst){
		for(var itm,i=0; itm=cls.instances[i],i<cls.instances.length; i++){
			if(itm===inst) return;
		}
		cls.instances.push(inst);
	}
	
	function removeInstance(cls, inst){
		var res = [];
		for(var itm,i=0; itm=cls.instances[i],i<cls.instances.length; i++){
			if(itm!==inst) res.push(itm);
		}
		cls.instances = res;
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
			for(var el,i=0,c=cls.instances; el=c[i],i<c.length; i++){
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
		getInstancesCount: function(classNm){return classIndex[classNm].instances.length;}
	};
});