(function(){
	function Module(){
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
			find: function(F){var _=this;
				var c = _.facets;
				for(var id in c){
					var el = c[id];
					if(el && F(el)) return el;
				}
			},
			select: function(F){
				var res = [];
				this.each(function(itm){
					if(itm && F(itm)) res.push(itm);
				});
				return res;
			},
			getAll: function(){
				return this.map();
			}
		});
		
		function addInstance(cls, itm, facetData){
			if(cls.facets[itm.__aesopID()]) return;
			var fc = new cls.facetConstructor(itm);
			fc.item = property(fc, itm).readonly();
			if(facetData) extend(fc, facetData);
			cls.facets[itm.__aesopID()] = fc;
		}
		
		function removeInstance(cls, itm){
			cls.facets[itm.__aesopID()] = null;
		}
		
		function getFacet(itm, classOrName){
			if(!classOrName) alert("Class "+classOrName+" does not exist!");
			var cls = typeof(classOrName)=="string"?classIndex[classOrName]:classOrName;
			return cls.facets[itm.__aesopID()];
		}
		
		var newID = (function(){
			var idx = 0;
			return function(){
				return ++idx;
			};
		})();
		
		function property(owner, initVal, onchange){
			var owner = owner,
				val = initVal,
				eventHandlers = [],
				readonly = false;
			if(onchange) eventHandlers.push(onchange);
				
			function F(v){
				if(v && !readonly){
					val = v;
					for(var e,c=eventHandlers,i=0; e=c[i],i<c.length; i++){
						if(e)e(owner, v);
					}
				}
				else return val;
			}
			F.readonly = function(){
				readonly = true;
				return this;
			}
			F.bind = function(handler){
				eventHandlers.push(handler);
				return eventHandlers.length - 1;
			};
			
			F.unbind = function(idx){
				var res = [];
				for(var h,c=eventHandlers,i=0; h=c[i],i<c.length; i++){
					if(i!=idx) res.push(h);
				}
				eventHandlers = res;
			}
			return F;
		}

		
		return {
			version: "2.5",
			Class: Class,
			classify: function(itm, className, facetData){
				if(!itm.__aesopID) itm.__aesopID = property(itm, newID()).readonly();
				if(!className){					for(var nm in classIndex){var cls = classIndex[nm];
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
			},
			property: property
		};
	}
	
	if(typeof(define)=="function") define([], Module);
	else Aesop = Module();
})();