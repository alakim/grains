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
	
	extend: function(o, s){
		KB.Collections.each(s, function(el, nm){ o[nm] = el;});
	}
};

(function(){
	var extend = KB.Collections.extend;
	var each = KB.Collections.each;
	var filter = KB.Collections.filter;
	
	extend(KB, {
		version: "2.4.92",
		instances: [],
		
		standardRelations:{
			is:{name:"is", inversion:"may be", description:"Устанавливает иерархию наследования сущностей"},
			uses:{name:"uses", inversion:"used by", description:"Обозначает использование одной сущности другой"},
			includes:{name:"includes", inversion:"included by", description:"Обозначает включение одной сущности в другую"}
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
	
	extend(KB.prototype, {
		items: {},
		relationTypes: {},
		relations:[],
		
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
		},
		
		getRelations: function(itm, inversion){
			inversion = inversion==null?false:inversion;
			return filter(this.relations, function(rel){
				return inversion? 
					rel.trg==itm
					:rel.src==itm;
			});
		}
	});
})()


