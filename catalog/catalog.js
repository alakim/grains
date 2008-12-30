if(typeof(Html)!="object")
	throw("Html module required!");

function Catalog(items){
	this.items = items;
	
	this.ID = Catalog.instances.length;
	Catalog.instances.push(this);
	this.init();
}

(function(){
	function extend(o, s){for(var k in s) o[k] = s[k];}
	
	function $(id){return document.getElementById(id);}
	function each(coll, act){
		for(var i=0; i<coll.length; i++){var el = coll[i];
			act(el, i);
		}
	}
	
	function remove(coll, el){
		var res = [];
		each(coll, function(e){
			if(e!=el)
				res.push(e);
		});
		return res;
	}
	
	function merge(c1, c2, andLogic, idF){
		if(!idF)
			idF = function(x){return x;}
		var h = {};
		function ins(x){
			var idx = idF(x);
			if(h[idx]==null)
				h[idx] = {itm:x, count:0};
			h[idx].count++;
		}
		each(c1, ins);
		each(c2, ins);
		var res = [];
		for(var k in h){
			if(andLogic){
				if(h[k].count==2)
					res.push(h[k].itm);
			}
			else{
				if(h[k])
					res.push(h[k].itm);
			}
		}
		return res;
	}
	
	function filter(coll, fF){
		var res = [];
		each(coll, function(itm){
			if(fF(itm)){
				res.push(itm);
			}
		});
		return res;
	}
	
	Catalog.prototype = {
		cloudPanelID:"cloud",
		subCloudPanelID:"cloud2",
		outPanelID:"out",
		statisticsPanelID:"stats",
		
		selectedTags:[],

		init: function(){var _=this;
			_.tags = [];
			
			each(_.items, function(itm){
				each(itm.tags, function(t){
					if(!_.tags[t])
						_.tags[t] = {items:[]};
					_.tags[t].items.push(itm);
				});
			});
		},
		
		display: function(){var _=this;
			
			var coll = [];
			for(var k in _.tags){var t = _.tags[k];
				coll.push(k);
			}
			
			coll = coll.sort(function(x,y){
				var x1 = x.toLowerCase();
				var y1 = y.toLowerCase();
				return x1>y1?1
					:x1<y1?-1
					:0;
			});
			
			with(Html){
				document.body.innerHTML = div(
					p({style:"text-align:right;", id:_.statisticsPanelID},
						"Total:", _.items.length, " items",
						", ", coll.length, " tags"
					),
					div({id:_.cloudPanelID},
						apply(coll, function(tname){
							return span({"class":"link pointer", onclick:"Catalog.show("+_.ID+",'"+tname+"')"},
								tname,"[",_.tags[tname].items.length,"]"
							);
						})
					),
					div({id:_.subCloudPanelID}),
					div({id:_.outPanelID})
				);
			}
		},
		
		showSubCloud: function(coll){with(Html){var _=this;
			var htmlSelected = apply(_.selectedTags, function(t){
				return span({"class":"selected pointer link", onclick:"Catalog.delTag("+_.ID+",'"+t+"')"}, t);
			});
			
			
			var subcloud = {};
			each(coll, function(itm){
				each(itm.tags, function(t){
					subcloud[t] = subcloud[t]?subcloud[t]+1:1;
				});
			});
			
			var subColl = [];
			
			for(var k in subcloud){var t = subcloud[k];
				subColl.push({nm:k, count:t});
			}
			subColl = subColl.sort(function(x, y){
				return x.count>y.count?-1
					:x.count<y.count?1
					:0;
			});
			
			var hSelected = {};
			each(_.selectedTags, function(t){
					hSelected[t] = 1;
			});
			
			subColl = filter(subColl, function(t){
				return hSelected[t.nm]!=1;
			});
			
			var superColl = [];
			
			var html = apply(subColl, function(t){
				if(t.count==coll.length)
					superColl.push(t);
				return span({"class":"link pointer", onclick:"Catalog.addTag("+_.ID+",'"+t.nm+"')"},
					t.nm, "[", subcloud[t.nm], "]"
				);
			});
			
			superColl = superColl.sort(function(x, y){
				xmetric = _.tags[x.nm].items.length;
				ymetric = _.tags[y.nm].items.length;
				return xmetric>ymetric?-1
					:xmetric<ymetric? 1
					:0;
			});
			
			var htmlSuper = apply(superColl, function(t){
				return span({"class":"link pointer", onclick:"Catalog.show("+_.ID+",'"+t.nm+"')"},
					t.nm, "[" ,_.tags[t.nm].items.length, "]"
				);
			});
			
			$(_.subCloudPanelID).innerHTML = htmlSuper + htmlSelected + html;
		}},
		
		showResult: function(tagID){var _=this;
			if(tagID)
				_.selectedTags = [tagID];
			
			var coll = [];
			
			each(_.selectedTags, function(t){
					coll = merge(coll, _.tags[t].items, coll.length, function(itm){return itm.url;});
			});
			
			_.showSubCloud(coll);
			
			with(Html){
				$(_.outPanelID).innerHTML = apply(coll, function(itm){
					var ttitle = itm.tags.join(",");
					return p(
						"[",
						span({"class":"link pointer", onclick:"Catalog.setConditions("+_.ID+", '"+ttitle+"')"},
							"like this"
						),
						"]",
						a({href:itm.url, title:ttitle},
							itm.label
						)
					);
				});
			}
		},
		
		addTag: function(tagID){var _=this;
			_.selectedTags.push(tagID);
			_.showResult();
		},
		
		delTag: function(tagID){var _=this;
			_.selectedTags = remove(_.selectedTags, tagID);
			_.showResult();
		},
		setConditions: function(tags){var _=this;
			_.selectedTags = tags.split(",");
			_.showResult();
		}
	}
	
	extend(Catalog, {
		version:"2.0.23",
		instances:[],
		
		getInstance: function(id){return Catalog.instances[id];},
		
		show: function(catID, tagID){
			Catalog.getInstance(catID).showResult(tagID);
		},
		addTag: function(catID, tagID){
			Catalog.getInstance(catID).addTag(tagID);
		},
		delTag: function(catID, tagID){
			Catalog.getInstance(catID).delTag(tagID);
		},
		setConditions: function(catID, tags){
			Catalog.getInstance(catID).setConditions(tags);
		}
	});
})();