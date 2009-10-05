function KB(data){
	for(var k in data){
		this[k] = data[k];
	}
	this.idx = KB.instances.length;
	KB.instances.push(this);
	this.init();
};

KB.Collections = {
	isArray: function(coll){return typeof(coll.length)!="undefined";},
	
	each: function(coll, F){
		if(coll==null) return;
		if(KB.Collections.isArray(coll)){
			for(var i=0; i<coll.length; i++){
				F(coll[i], i);
			}
		}
		else{
			for(var k in coll){
				F(coll[k], k);
			}
		}
	},
	
	count: function(coll){
		if(typeof(coll.length)!="undefined")
			return coll.length;
		else{
			var count = 0;
			for(var k in coll) count++;
			return count;
		}
	},
	
	filter: function(coll, cond, arrayMode){
		var arrayMode = arrayMode!=null ?arrayMode :KB.Collections.isArray(coll);
		var res = arrayMode?[]:{};
		KB.Collections.each(coll, function(el, k){
			if(cond(el, k)){
				if(arrayMode)
					res.push(el);
				else
					res[k] = el;
			}
		});
		return res;
	},
	
	find: function(coll, cond){
		if(KB.Collections.isArray(coll)){
			for(var i=0; i<coll.length; i++){
				var el = coll[i];
				if(cond(el, i))
					return el;
			}
		}
		else{
			for(var k in coll){
				var el = coll[k];
				if(cond(el, k))
					return el;
			}
		}
	},
	
	extend: function(o, s){
		KB.Collections.each(s, function(el, nm){ o[nm] = el;});
	}
};

(function(){
	var extend = KB.Collections.extend;
	var each = KB.Collections.each;
	var filter = KB.Collections.filter;
	var find = KB.Collections.find;
	
	extend(KB, {
		version: "2.6.197",
		instances: [],
		
		standardRelations:{
			is:{name:"is", inversion:"may be", description:"Устанавливает иерархию наследования сущностей"},
			uses:{name:"uses", inversion:"used by", description:"Обозначает использование одной сущности другой"},
			includes:{name:"includes", inversion:"included by", description:"Обозначает включение одной сущности в другую"}
		},
		
		standardRules:{
			findUndefinedItems: function(kb){
				var relationsToUndefinedItems = filter(kb.relations, function(rel){
					return typeof(rel.trg)=="string";
				});
				var dict = {};
				each(relationsToUndefinedItems, function(r){dict[r.trg] = true;});
				each(dict, function(v, name){
					kb.errors.log("undefined item", name);
				});
			},
			
			circularReferences: function(kb){
				kb.errors.log("not implemented rule", "Standard rule 'circularReferences' is not implemented");
			}
		},
		
		getInstance: function(idx){
			return KB.instances[idx];
		},
		
		init: function(){
			each(KB.instances, function(inst){
				inst.init();
			});
		},
		
		addEventHandler: function(element, event, handler){
			if(element.addEventListener)
				element.addEventListener(event, handler, true);
			else
				element.attachEvent("on"+event, handler);
		}
	});
	
	function Log(){
		var items = [];
		this.log = function(type, msg){items.push({type:type, message:msg});};
		this.getItems = function(){return items.concat();};
		this.clear = function(){items = [];};
		this.$count = function(){return items.length;};
		this.render = function(template){return Html.apply(items, template);};
	};
	
	extend(KB.prototype, {
		items: {},
		relationTypes: {},
		relations:[],
		errors:new Log(),
		rules:[],
		
		checkRules: function(){var _=this;
			each(KB.standardRules, function(r){(r(_))});
			each(_.rules, function(r){r(_)});
			each(_.relationTypes, function(relType){
				each(relType.rules, function(r){r(_, relType);});
			});
			each(_.items, function(itm){
				each(itm.rules, function(r){r(_, itm);});
			});
		},
		
		setItemIDs: function(){
			each(this.items, function(itm, id){
				itm.id = id;
			});
		},
		
		setItemRelations: function(itm){var _=this;
			if(!itm.relations || itm.relations.length==0)
				return;
			each(itm.relations, function(rel){
				_.relations.push({
					type: _.relationTypes[rel.type],
					src: itm,
					trg: _.items[rel.trg]?_.items[rel.trg]:rel.trg,
					truth: rel.truth
				});
			});
		},
		
		setRelations: function(relations){var _=this;
			each(relations, function(rel, i){
				_.relations.push({
					type: _.relationTypes[rel.type], 
					src: _.items[rel.src]?_.items[rel.src]:rel.src,
					trg: _.items[rel.trg]?_.items[rel.trg]:rel.trg
				});
			});
		},
		
		setDefaultNames: function(){var _=this;
			each(_.items, function(itm, nm){
				if(!itm.name || itm.name.lenght==0)
					itm.name = nm;
			});
		},
		
		init:function(){var _=this;
			_.setDefaultNames();
			_.setItemIDs();
			each(_.items, function(itm){
				_.setItemRelations(itm);
			});
			_.checkRules();
		},
		
		getRelations: function(itm, inversion){
			inversion = inversion==null?false:inversion;
			return filter(this.relations, function(rel){
				return inversion? 
					rel.trg==itm
					:rel.src==itm;
			});
		},
		
		getRelationPath: function(item, relType){var _=this;
			return item==null?[]:[item].concat(_.getRelationPath(_.getRelationTarget(item, relType), relType));
		},
		
		getRelationTree: function(item, relType, inversion){var _=this;
			if(item==null)return [];
			var tree = [item];
			var targets = _.getRelationTargets(item, relType, inversion);
			if(targets){
				tree.push([]);
				each(targets, function(trg){
					tree[1].push(_.getRelationTree(trg, relType, inversion));
				});
			}
			return tree;
		},
		
		getRelationTargets: function(item, relType, inversion){var _=this;
			if(!item.relations)
				return null;
			var rels = filter(_.getRelations(item, inversion), function(rel){return inversion?rel.type.inversion==relType:rel.type.name==relType;});
			var res = [];
			each(rels, function(rel){
				var trgId = inversion?rel.src:rel.trg;
				var t = _.items[trgId];
				res.push(t?t:trgId);
			});
			return res;
		},
		
		getRelationTarget: function(item, relType){var _=this;
			if(!item.relations)
				return null;
			var rel = find(item.relations, function(rel){
				return rel.type==relType;
			});
			if(rel)
				return _.items[rel.trg];
		}
	});
})()


