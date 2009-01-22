if(typeof(Html)!="object")
	throw("Html module required!");

function Catalog(items){
	this.items = items;
	this.history = [];
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
		errorPanelID:"errors",
		statisticsPanelID:"stats",
		highlightFieldID:"highlight",
		
		reHighlight:null,
		
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
			with(Html){
				document.body.innerHTML = div(
					p({style:"text-align:right;"},
						span({id:_.statisticsPanelID}),
						input({type:"text", id:_.highlightFieldID}),
						button({onclick:"Catalog.highlightStrings("+_.ID+")"}, "найти"),
						" ",
						span({"class":"link pointer", onclick:"Catalog.checkData("+_.ID+")"}, "check data")
					),
					div({id:_.cloudPanelID}),
					div({id:_.subCloudPanelID}),
					div({id:_.outPanelID}),
					div({id:_.errorPanelID})
				);
			}
			_.showCloud();
		},
		
		showCloud: function(){var _=this;with(Html){
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
			
			$(_.statisticsPanelID).innerHTML = span(
				"Total:", _.items.length, " items",
				", ", coll.length, " tags "
			);
			
			$(_.cloudPanelID).innerHTML = apply(coll, function(tname){
				var mt = tname.match(_.reHighlight);
				return span({"class":"link pointer", style:mt?"background-color:#ffff00;":"", onclick:"Catalog.show("+_.ID+",'"+tname+"')"},
					tname.replace(/\s+/, "&nbsp;"),"[",_.tags[tname].items.length,"]"
				)+" ";
			});
		}},
		
		showSubCloud: function(coll){with(Html){var _=this;
			var htmlSelected = apply(_.selectedTags, function(t, i){
				return (i>0?"&amp;":"") + 
					span({"class":"selected pointer link", onclick:"Catalog.delTag("+_.ID+",'"+t+"')"}, 
						t.replace(/\s+/g, "&nbsp;"),
						"[",
						_.tags[t].items.length,
						"]"
					)+" ";
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
				if(t.count==coll.length){
					superColl.push(t);
					return "";
				}
				var mt = t.nm.match(_.reHighlight);
				return span({"class":"link pointer", style:mt?"background-color:#ffff00;":"", onclick:"Catalog.addTag("+_.ID+",'"+t.nm+"')"},
					t.nm.replace(/\s+/,"&nbsp;"), "[", subcloud[t.nm], "/"+_.tags[t.nm].items.length+"]"
				)+" ";
			});
			
			superColl = superColl.sort(function(x, y){
				xmetric = _.tags[x.nm].items.length;
				ymetric = _.tags[y.nm].items.length;
				return xmetric>ymetric?-1
					:xmetric<ymetric? 1
					:0;
			});
			
			var htmlSuper = apply(superColl, function(t){
				var mt = t.nm.match(_.reHighlight);
				return span({"class":"link pointer", style:mt?"background-color:#ffff00;":"", onclick:"Catalog.show("+_.ID+",'"+t.nm+"')"},
					t.nm, "[" ,_.tags[t.nm].items.length, "]"
				)+" ";
			});
			
			$(_.subCloudPanelID).innerHTML = div(
				_.history.length,
				_.history.length>-1?button({onclick:"Catalog.historyBack("+_.ID+")"}, "&lt;&lt;"):"",
				" ", htmlSuper, htmlSelected, html
			);
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
				$(_.outPanelID).innerHTML = 
				div(
					div(coll.length, " item", (coll.length.toString().match(/1$/)?"":"s")," found"),
					table({border:0},
						apply(coll, function(itm){
							var ttitle = itm.tags.join(",");
							return tr(
								td({"class":"tagsColumn", width:"30%"},
									span({"class":"link pointer", style:"margin:0px;", onclick:"Catalog.setConditions("+_.ID+", '"+ttitle+"')"},
										apply(itm.tags, function(itag, i){
											return (i>0?", ":"") + itag;
										})
									)
								),
								td(
									a({href:itm.url, title:ttitle},
										Catalog.itemTitleTemplate(itm)
									)
								),
								td({"class":"details"},
									Catalog.itemDetailsTemplate(itm)
								)
							);
						})
					)
				);
			}
		},
		
		addTag: function(tagID){var _=this;
			_.selectedTags.push(tagID);
			_.showResult();
			_.addToHistory();
		},
		
		delTag: function(tagID){var _=this;
			_.selectedTags = remove(_.selectedTags, tagID);
			_.showResult();
			_.addToHistory();
		},
		setConditions: function(tags){var _=this;
			_.selectedTags = tags.split(",");
			_.showResult();
			_.addToHistory();
		},
		
		checkData: function(){var _=this;
			function displayDuplicate(itm){
				$(_.errorPanelID).innerHTML += Html.div({style:"color:red"}, "Обнаружены дубликаты элемента ", itm.url);
			}
			function displayVariant(t){
				$(_.errorPanelID).innerHTML+=Html.div({style:"color:#ff00aa;"}, "Обнаружены разные варианты написания тега \"", t, "\"");
			}
			$(_.errorPanelID).innerHTML = "";
			var errorsFound = false;
			var urls = {};
			var tags = {};
			each(_.items, function(itm){
				if(urls[itm.url]!=null){
					errorsFound = true;
					displayDuplicate(itm);
				}
				urls[itm.url] = 1;
				each(itm.tags, function(t){
					var tL = t.toLowerCase();
					if(tags[tL]==null)
						tags[tL] = t;
					else if(tags[tL]!=t){
						errorsFound = true;
						displayVariant(t);
					}
				});
			});
			if(!errorsFound)
				$(_.errorPanelID).innerHTML = Html.div({style:"fond-weight:bold; color:#008800;"}, "Ошибок не обнаружено");
		},
		
		highlightStrings: function(){var _=this;
			_.reHighlight = new RegExp($(_.highlightFieldID).value, "ig");
			_.showCloud();
		},
		
		addToHistory: function(){var _=this;
			_.history.push(_.selectedTags.join(","));
		},
		
		historyBack: function(){var _=this;
			_.history.pop();
			var prev = _.history[_.history.length-1];
			if(!prev || !prev.length)
				return;
			_.selectedTags = prev.split(",");
			_.showResult();
		}
	}
	
	extend(Catalog, {
		version:"3.2.66",
		instances:[],
		
		itemTitleTemplate: function(itm){
			return itm.label && itm.label.length?itm.label:itm.url;
		},
		
		itemDetailsTemplate:function(itm){
			return itm.description?itm.description
				:itm.dsc?itm.dsc
				:itm.details?itm.details
				:null;
		},
		
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
		},
		checkData: function(catID){
			Catalog.getInstance(catID).checkData();
		},
		historyBack: function(catID){
			Catalog.getInstance(catID).historyBack();
		},
		highlightStrings: function(catID){
			Catalog.getInstance(catID).highlightStrings();
		}
	});
})();