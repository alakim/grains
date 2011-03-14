var JFx = (function(){
	var version = "0.0.0";
	
	function extend(o,s){for(var k in s) o[k] = s[k]; return o;}
	function each(coll, F){
		if(coll instanceof Array)
			for(var i=0; i<coll.length; i++){
				if(F(coll[i], i)==false) break;
			}
		else
			for(var k in coll) {
				if(F(coll[k], k)==false) break;
			}
	}
	function eachIdx(coll, F){
		for(var i=0; i<coll.length; i++) {
			if(F(coll[i], i)==false)
				break;
		}
	}
	
	function getAttributes(obj){
		var attributes = {};
		var attrCount = 0;
		for(var k in obj){
			if(k=="_") continue;
			var idx = parseInt(k);
			if(isNaN(idx) || idx>=obj.length){
				attributes[k] = obj[k];
				attrCount++;
			}
		}
		return attrCount?attributes:null;
	}
	
	function selectItems(itm, path){
		var path = path.split("/");
		var q = _.Query(itm);
		eachIdx(path, function(step){
			if(!step.length){q = q.Root(); return;}
			
			var mt = step.match(/^@(.+)$/); //по атрибуту
			if(mt) {q = q.Attribute(mt[1]); return;}
			
			mt = step.match(/#(.+)/); // по ID
			if(mt){q = q.ID(mt[1]); return;}
			
			mt = step.match(/^([^\[]+)\[(\d+)\]/); // по индексу
			if(mt){q = q.Children(mt[1], parseInt(mt[2])); return;}
			
			q = q.Children(step);
		});
		return q;
	}
	
	function jxml(obj){
		if(!(obj instanceof Array))
			return obj;
		if(!(obj._)) return obj;
		
		var attributes = getAttributes(obj);
		if(obj._.id){
			if(!attributes) attributes = {};
			attributes.id = obj._.id;
		}
		var children = [];
		for(var i=0; i<obj.length; i++){
			children.push(jxml(obj[i]));
		}
		var res = [obj._.type];
		if(attributes) res.push(attributes);
		if(children.length) res.push(children);
		return res;
	}
	
	function validate(root){
		verifyIDs(root);
	}
	
	function verifyIDs(root){
		var idIdx = {};
		function indexIds(el){
			if(el._ && el._.id){
				if(idIdx[el._.id]) throw "Indentifier '"+el._.id+"' already used!";
				idIdx[el._.id] = el;
			}
			if(el instanceof Array){
				for(var i=0; i<el.length; i++){
					indexIds(el[i]);
				}
			}
		}
		indexIds(root);
		root._.getByID = function(id){
			return idIdx[id];
		};
	}
	
	var ID = (function(){
		var f = function(id){
			return {type:"id", id:id};
		};
		var counter = 0;
		extend(f, {
			newID: function(){
				var t = new Date().getTime();
				return f("id"+(counter++)+t);
			}
		});
		return f;
	})();
	
	var _ = {
		version: version,
		Schema: function(){
			var schema = {
				ID: ID
			};
			schema._ = {};
			eachIdx(arguments, function(itmDef, i){
				schema[itmDef.type] = itmDef; 
				if(i==0){
					schema._.root = itmDef;
					itmDef.isRoot = true;
				}
			});
			return schema;
		},
		Item: function(type){
			function itmConstructor(){
				var itmDef = arguments.callee;
				var item = [];
				extend(item, {
					_:{
						type:type,
						$jxml:function(){return jxml(item)},
						$attributes: function(){return getAttributes(item);},
						$root: function(){return item._.parent?item._.parent.$root():item;},
						select: function(path){return selectItems(item, path);}
					}
				});
				eachIdx(arguments, function(el, i){
					switch(el.type){
						case "id": item._.id = el.id; break;
						default:
							bindChild(item, el, i);
							break;
					}
				});
				
				if(itmDef.isRoot)
					validate(item);
				return item;
			}
			extend(itmConstructor, {
				type:type,
				schema:{attributes:{}, items:[]}
			});
			eachIdx(arguments, function(el){
				switch(el.type){
					case "attribute": itmConstructor.schema.attributes[el.idx] = el; break;
					case "item": itmConstructor.schema.items.push(el); break;
					default: break; //throw "Element type "+el.type+" not supported!";
				}
			});
			
			function bindChild(parent, child, idx){
				if(itmConstructor.schema.attributes[idx])
					parent[itmConstructor.schema.attributes[idx].name] = child;
				else{
					if(child._){
						child._.parent = parent;
						parent.push(child);
					}
					else if(typeof(child)=="object")
						extend(parent, child);
					else
						parent.push(child);
				}
			}
			return itmConstructor;
		},
		Child: function(type, mult){
			return {type:"item", type:type, mult:mult};
		},
		Attr: function(name, idx){
			return {type:"attribute", name:name, idx:idx};
		},
		count: function(coll){
			if(coll instanceof Array) return coll.length;
			var count = 0;
			for(var k in coll) count++;
			return count;
		},
		
		Lambda: function(f){
			if(typeof(f)=="function")return f;
			if(typeof(f)!="string") throw "Lambda: string expected";
			f = f.split("=>");
			return new Function(f[0], "return "+f[1]);
		},
		
		Query: function(obj, selector){
			if(typeof(selector)=="string"){
				return selectItems(obj, selector);
			}
			if(typeof(selector)=="function"){
				var res = selector(obj);
				console.log("res: ", res);
				return res;
			}
			
			function buildSet(coll){
				return extend(coll, {
					Root: root,
					Children:children,
					ID:id,
					Where:where,
					First:first,
					Attribute:attribute,
					Text:text
				})
			}
			function root(){
				if(!this.length) throw "Query.Root error: No elements in collection.";
				return buildSet([this[0]._.$root()]);
			}
			function children(type, idx){
				var coll = [];
				eachIdx(this, function(el){
					var c1 = [];
					eachIdx(el, function(ch){
						if(!type || (type=="text()"&&typeof(ch)=="string") || ch._.type==type){
							c1.push(ch);
							if(idx!=null && c1.length==idx+1){
								c1 = [c1[idx]];
								return false;
							}
						}
					});
					coll = coll.concat(c1);
				});
				return buildSet(coll);
			}
			function attribute(name){
				var coll = [];
				eachIdx(this, function(el){
					if(el[name])
						coll.push(el[name]);
				});
				return buildSet(coll);
			}
			function where(cond){
				cond = JFx.Lambda(cond);
				var res = [];
				eachIdx(this, function(el){
					if(cond(el)) res.push(el);
				});
				return buildSet(res);
			}
			function first(){
				return this[0];
			}
			function id(id){
				return buildSet([this[0]._.getByID(id)]);
			}
			function text(){
				return this.Children("text()")
			}
			
			return buildSet([obj]);
		},
		
		Processor: function(root){
			function processObject(obj, proc){
				var res = [];
				each(proc.templates, function(tpl){
					var set = JFx.Query(obj, tpl.selector);
					console.log("set: ", set);
					if(set){
						each(set, function(el){
							res.push(tpl(el));
						});
						return false;
					}
				});
				return res;
			}
			function processSet(set, proc){
				var res = [];
				each(set, function(el){
					res = res.concat(processObject(el, proc));
				});
				return res;
			}
			var proc = {
				root:root,
				templates:[],
				process:function(obj){
					return this.root(obj);
				},
				applyTemplates: function(o){
					if(o._) return processObject(o, this);
					else if(o instanceof Array) return processSet(o, this);
					else return processObject(o, this);
				}
			};
			for(var i=1; i<arguments.length; i++){
				proc.templates.push(arguments[i])
			}
			return proc;
		},
		Template: function(selector, templateFunc){
			templateFunc.selector = selector;
			return templateFunc;
		}
	};
	
	return _;
})();