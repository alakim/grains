if(typeof(Html)=="undefined") alert("Module html.js required!");

function KB(data){
	this.relations = [];
	for(var k in data){
		this[k] = data[k];
	}
	this.idx = KB.instances.length;
	KB.instances.push(this);
	this.init();
};

KB.version = "3.3.80";

KB.compareVersions = function(v1, v2){
	if(!v1 || !v2) return 0;
	function parseVersion(v){
		v = v.split(".");
		for(var i=0; i<v.length; i++) v[i] = parseInt(v[i], 10);
		return v;
	}
	v1 = parseVersion(v1); v2 = parseVersion(v2);
	for(var i=0; i<3; i++){
		if(v1[i]>v2[i]) return 1;
		if(v1[i]<v2[i]) return -1;
	}
	return 0;
}

KB.range = function(minValue, maxValue){
	return {min:minValue, max:maxValue};
};

KB.Functions = {
	is: function(kb, objNm, genNm){
		var src = kb.items[objNm];
		var trgs = kb.getRelationTargets(src, "is", false);
		if(!trgs || !trgs.length) return false;
		for(var i=0; i<trgs.length; i++){var t = trgs[i];
			if(t.id==genNm) return true;
			else{
				var f = KB.Functions.is(kb, t.id, genNm);
				if(f) return true;
			}
		}
		return false;
	}
};

KB.Collections = {
	isArray: function(coll){return typeof(coll.length)!="undefined";},
	
	Stack: function(){
		var items = [];
		this.push = function(el){
			items = [el].concat(items);
		}
		this.pop = function(){
			var v = items[0];
			items = items.splice(1);
			return v;
		}
		this.$head = function(){return items[0];}
	},
	
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
	
	contains: function(array, item){
		for(var i=0; i<array.lenght; i++)
			if(array[i]==item) return true;
		return false;
	},
	
	keys: function(dict){
		var res = [];
		for(var k in dict) res.push(k);
		return res;
	},
	
	extend: function(o, s){
		KB.Collections.each(s, function(el, nm){ o[nm] = el;});
	},
	
	nDictionary: function(arity){
		if(!arity || arity<1) throw "nDictionary construction error: arity >= 1 expected";
		var N = arity;
		var dict = {};
		
		this.set = function(coords, val){
			checkDimensions(coords);
			var d = dict;
			for(var i=0; i<coords.length-1; i++){
				var x = coords[i];
				if(typeof(d[x])=="undefined")
					d[x] = {};
				d = d[x];
			}
			d[coords[coords.length-1]] = val;
		};
		
		this.get = function(coords){
			checkDimensions(coords);
			var d = dict;
			for(var i=0; i<coords.length; i++){
				d = d[coords[i]];
				if(typeof(d)=="undefined") return null;
			}
			return d;
		};
		
		this.getKeys = function(coords){
			if(coords.length>N-1) throw "nDictionary dimension error. Too many coordinates.";
			var d = dict;
			for(var i=0; i<coords.length; i++){
				d = d[coords[i]];
				if(typeof(d)=="undefined") return null;
			}
			return KB.Collections.keys(d);
		}
		
		function checkDimensions(coords){
			if(coords.length!=N) throw "nDictionary dimension error. Expected dimension "+N+", but given "+coords.length+" coordinates";
		}
	}
};

function defaultMarkup(content){return content.toString();}

KB.Markup = {
	p: defaultMarkup,
	quote:defaultMarkup,
	ref:defaultMarkup
};

KB.Article = (function(){
	var items = {};
	var __ = function(id, title, url){
		items[id] = {url:url, title:title};
	}
	
	__.items = items;
	
	return __;
})();

(function(){
	var extend = KB.Collections.extend;
	var each = KB.Collections.each;
	var filter = KB.Collections.filter;
	var find = KB.Collections.find;
	var contains = KB.Collections.contains;
	var nDictionary = KB.Collections.nDictionary;
	
	extend(KB, {
		maxDistance:5,
		instances: [],
		
		standardRelations:{
			is:{name:"is", inversion:"may be", description:"”станавливает иерархию наследовани€ классов сущностей"},
			instanceOf:{name:"is instance of", inversion:"has instance", description:"”казывает, что данна€ сущность €вл€етс€ зкземпл€ром заданного класса."},
			uses:{name:"uses", inversion:"used by", description:"ќбозначает использование одной сущности другой"},
			includes:{name:"includes", inversion:"included by", description:"ќбозначает включение одной сущности в другую"},
			like:{name:"like", inversion:"like", description:"ќбозначает некоторое сходство между сущност€ми"},
			comesFrom:{name:"comes from", inversion:"predecessor of", description:"”казывает на происхождение сущности (в историческом аспекте)."},
			intendedFor:{name:"предназначен дл€", inversion:"обеспечиваетс€", description:"”казывает на предназначение сущности."},
			refTo:{name:"referedTo", inversion:"referedBy", description:"указывает св€зь (обобщенную) сущностей"}
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
			
			// circularReferences: function(kb){
			// 	kb.errors.log("not implemented rule", "Standard rule 'circularReferences' is not implemented");
			// },
			
			duplicateRelations: function(kb){
				var dict = new nDictionary(3);
				each(kb.relations, function(rel){
					if(dict.get([rel.trg.id, rel.src.id, rel.type]))
						kb.errors.log("duplicate relations", "Duplicate relation of type '"+rel.type.id+"' between items '"+rel.src.id+"' and '"+rel.trg.id+"'");
					dict.set([rel.src.id, rel.trg.id, rel.type], true);
				});
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
		this.getItems = function(type){
			if(!type) return items.concat();
			return filter(items, function(itm){return itm.type==type;});
		};
		this.clear = function(){items = [];};
		this.$count = function(){return items.length;};
		this.render = function(template){return Html.apply(items, template);};
	};
	
	extend(KB.prototype, {
		items: {},
		relationTypes: {},
		relations:null,
		errors:null,
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
		
		buildRelationLists: function(itm){
			if(itm.relations.constructor==Array) return;
			var relColl = [];
			each(itm.relations, function(relDefs, nm){
				if(typeof(relDefs)=="string")
					relDefs = relDefs.split(";");
				each(relDefs, function(rel){
					if(typeof(rel)!="string")
						relColl.push(rel);
					else{
						var mt = rel.match(/^([^\(]+)(\((\d+([\.\,]\d+)?)\))?$/i);
						var trgNm = RegExp.$1;
						var truth = RegExp.$3;
						var relDef = {
							type:nm,
							trg:trgNm,
							truth: truth!=null&&truth.length>0? parseFloat(truth.replace(",",".")):-1
						};
						relColl.push(relDef);
					}
				});
			});
			itm.relations = relColl;
		},
		
		buildRelationIndex: function(itm){var _=this;
			var relDict = {};
			each(itm.relations, function(rel){
				if(!rel.type)return;
				var relId = rel.type.id;
				if(!relDict[relId]) relDict[relId] = [];
				relDict[relId].push(rel);
			});
			itm.relationIndex = relDict;
		},
		
		setItemRelations: function(itm){var _=this;
			if(itm.relations){
				_.buildRelationLists(itm);
				
				var rels = [];
				
				for(var i=0; i<itm.relations.length; i++){
					var rel = itm.relations[i];
					var relType = _.relationTypes[rel.type];
					if(!relType){
						_.errors.log("Undefined relation", Html.format("Undefined relation '{0}' for item '{1}'", rel.type, itm.id));
						continue;
					}
					var relInst = {
						id:_.relations.length,
				 		type: relType,
				 		src: itm,
				 		trg: _.items[rel.trg]?_.items[rel.trg]:rel.trg,
				 		truth: rel.truth
				 	};
					_.relations.push(relInst);
					itm.relations[i] = relInst;
				}
				_.buildRelationIndex(itm);
			}
		},
		
		buildInversionLists: function(itm){var _=this;
			itm.backRelations = [];
			itm.backRelationIndex = {};
			each(_.getRelations(itm, true), function(rel){
				if(!rel.type) return;
				itm.backRelations.push(rel);
				var relId = rel.type.id;
				if(!itm.backRelationIndex[relId])
					itm.backRelationIndex[relId] = [];
				itm.backRelationIndex[relId].push(rel);
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
			_.errors = new Log();
			extend(_.relationTypes, KB.standardRelations);
			_.setDefaultNames();
			_.setItemIDs();
			each(_.relationTypes, function(relType, nm){relType.id = nm;});
			each(_.items, function(itm){_.setItemRelations(itm);});
			each(_.items, function(itm){_.buildInversionLists(itm)});
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
		
		getRelTypeID: function(relTypeName){var _=this;
			var res;
			each(_.relationTypes, function(r, id){
				if(r.name==relTypeName || r.inversion==relTypeName){
					res = id; return;
				}
			});
			return res;
		},
		
		getRelationPath: function(item, relType){var _=this;
			return item==null?[]:[item].concat(_.getRelationPath(_.getRelationTarget(item, relType), relType));
		},
		
		getRelation: function(itm1, itm2, relTypeID){var _=this;
			var rel;
			if(itm1.relationIndex) each(itm1.relationIndex[relTypeID], function(r){
				if(r.trg==itm2) rel = r;
			});
			if(!rel && itm2.relationIndex) each(itm2.relationIndex[relTypeID], function(r){
				if(r.trg==itm1) rel = r;
			});
			return rel;
		},
		
		getRelationTree: function(item, relTypeName, inversion){var _=this;
			if(item==null)return null;
			if(typeof(item)=="string" && !_.items[item]){
				return {node:item};
			}
			if(typeof(item)=="string") item = _.items[item];
			var tree = {node:item.id};
			var targets = _.getRelationTargets(item, relTypeName, inversion);
			if(targets && targets.length){
				tree.targets = [];
				each(targets, function(trg){
					tree.targets.push(_.getRelationTree(trg, relTypeName, inversion));
				});
				
			}
			var relTypeID = _.getRelTypeID(relTypeName);
			each(tree.targets, function(trg){
				var r = _.getRelation(_.items[trg.node], item, relTypeID);
				if(r && r.truth!=null && r.truth>=0)
					trg.truth = r.truth;
			});
			return tree;
		},
		
		getRelationTargets: function(item, relType, inversion){var _=this;
			if(inversion?!item.backRelations:!item.relations) return null;

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
		},
		
		getDistances: function(itm, res, dist, startId){var _=this;
			startId = startId?startId:itm.id;
			res = res?res:{};
			dist = dist?dist:1;
			if(dist>KB.maxDistance) return res;
			var visitedRels = {};
			
			each(_.getRelations(itm, false), function(rel){
				if(visitedRels[rel.id]) return;
				visitedRels[rel.id] = true;
				var tid = rel.trg.id;
				if(tid==startId) return;
				if(!res[tid] || dist<res[tid])
					res[tid] = dist;
				_.getDistances(rel.trg, res, dist+1, startId);
			});
			
			visitedRels = {};
			each(_.getRelations(itm, true), function(rel){
				if(visitedRels[rel.id]) return;
				visitedRels[rel.id] = true;
				var tid = rel.src.id;
				if(tid==startId) return;
				if(!res[tid] || dist<res[tid])
					res[tid] = dist;
				_.getDistances(rel.src, res, dist+1, startId);
			});
			return res;
		},
		
		groupDistances: function(distTable){var _=this;
			var distList = [];
			each(distTable, function(dist, iId){
				var idx = dist - 1;
				if(typeof(distList[idx])=="undefined") distList[idx] = [];
				distList[idx].push(iId);
			});
			return distList;
		},
		
		getNeighbors: function(itmList){var _=this;
			var res;
			each(itmList, function(itmId){
				var distTable = _.getDistances(_.items[itmId]);
				if(!res) res = distTable;
				else each(distTable, function(d, iId){res[iId]*=d;});
			});
			return res;
		}
	});
})()


