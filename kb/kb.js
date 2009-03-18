if(typeof(Html)=="undefined")
	alert("Html module required!");

function KB(data){
	for(var k in data){
		this[k] = data[k];
	}
	KB.instances.push(this);
};

(function(){
	function $(id){return document.getElementById(id);}
	function isArray(coll){return typeof(coll.length)!="undefined";}
	function each(coll, F){
		if(isArray(coll)){
			for(var i=0; i<coll.length; i++){
				F(coll[i], i);
			}
		}
		else{
			for(var k in coll){
				F(coll[k], k);
			}
		}
	}
	
	function filter(coll, cond){
		var arrayMode = isArray(coll);
		var res = arrayMode?[]:{};
		each(coll, function(el, k){
			if(cond(el)){
				if(arrayMode)
					res.push(el);
				else
					res[k] = el;
			}
		});
		return res;
	}
	
	function extend(o, s){
		each(s, function(el, nm){ o[nm] = el;});
	}
	
	extend(KB, {
		instances: [],
		
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
		panelID:"", 
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
					trg: _.items[rel.trg],
					truth: rel.truth
				});
			});
		},
		
		setRelations: function(relations){var _=this;
			each(relations, function(rel, i){
				_.relations.push({
					type: _.relationTypes[rel.type], 
					src: _.items[rel.src],
					trg: _.items[rel.trg]
				});
			});
		},
		
		setDefaultNames: function(){var _=this;
			each(_.items, function(itm, nm){
				if(!itm.name || itm.name.lenght==0)
					itm.name = nm;
			});
		},
		
		itemDisplay: function(itm){with(Html){var _=this;
			return div({"class":"itemPanel"},
				p({"class":"itemName"}, 
					a({name:itm.id},
						span({"class":"itemName"}, itm.name), ": "
					),
					apply(_.getRelations(itm, false), function(rel, i){
						return span(
							i>0?", ":"",
							" ", 
							span({"class":"relation"}, rel.type.name,
								rel.truth?span(" (", rel.truth, ")"):null
							), 
							" ", 
							a({href:"#"+rel.trg.id}, rel.trg.name), 
							" "
						);
					}),
					
					apply(_.getRelations(itm, true), function(rel, i){
						return span(
							i>0?", ":"",
							" ", 
							span({"class":"relation"},
								rel.type.inversion,
								rel.truth?span(" (", rel.truth, ")"):null
							), 
							" ", 
							a({href:"#"+rel.src.id}, rel.src.name), 
							" "
						);
					})
				),
				div({"class":"details"},
					itm.description?p(itm.description):null,
					apply(itm.refs, function(ref, i){
						return span(
							i>0?", ":null,
							a({href:ref.url}, ref.title)
						);
					})
				)
			);
		}},
		
		displayMainView: function(){with(Html){var _=this;
			$(_.panelID).innerHTML = div(
				h1(_.name),
				apply(_.items, function(itm){return _.itemDisplay(itm);})
			);
		}},
		
		init:function(){var _=this;
			_.setDefaultNames();
			_.setItemIDs();
			each(_.items, function(itm){
				_.setItemRelations(itm);
			});
			_.displayMainView();
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

KB.addEventHandler(window, "load", KB.init);


