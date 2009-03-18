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
		
		setItemRelations: function(itm){var _=this;
			if(!itm.relations || itm.relations.length==0)
				return;
			each(itm.relations, function(rel){
				_.relations.push({
					type: _.relationTypes[rel.type],
					src: itm,
					trg: _.items[rel.trg]
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
		
		displayMainView: function(){with(Html){var _=this;
			$(_.panelID).innerHTML = div(
				h1(_.name),
				apply(_.items, function(itm){
					return div({style:"border:1px solid #888888; padding:3px; margin:5px;"},
						p({style:"margin-top:0px; margin-bottom:3px;"},
							span({style:"font-weight:bold;"}, itm.name), ": ",
							apply(_.getRelations(itm, false), function(rel, i){
								return span(
									i>0?", ":"",
									" ", 
									span({style:"color:#888888;"}, rel.type.name), 
									" ", rel.trg.name, " "
								);
							}),
							
							apply(_.getRelations(itm, true), function(rel, i){
								return span(
									i>0?", ":"",
									" ", 
									span({style:"color:#888888;"}, rel.type.inversion), 
									" ", rel.src.name, " "
								);
							})
						),
						div({style:"margin-left:20px;"},
							itm.description?p({style:"margin-top:0px; margin-bottom:0px;"}, itm.description):null,
							apply(itm.refs, function(ref, i){
								return a({href:ref.url}, ref.title);
							})
						)
					);
				})
			);
		}},
		
		init:function(){var _=this;
			_.setDefaultNames();
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


