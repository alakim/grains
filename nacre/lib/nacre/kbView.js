if(typeof(KB)=="undefined")
	alert("KB module required!");

if(typeof(Html)=="undefined")
	alert("Html module required!");

function KbView(kb, panelID){
	this.idx = KbView.instances.length;
	KbView.instances.push(this);
	
	this.kb = kb;
	this.panelID = panelID;
}

KB.markup = {
	p: function(){
		var res = [];
		for(var i=0; i<arguments.length; i++){
			res.push(arguments[i]);
		}
		return Html.p(res.join(""));
	},
	quote: function(q){
		return Html.span({style:"font-style:italic;"},
			q.text,
			"(",
			KB.markup.ref(q.ref),
			")"
		);
	},
	ref: function(r){
		if(typeof(r)=="string"){
			var rr = KB.Article.items[r];
			if(!rr) return Html.span({style:"background-color:red;"}, "ID ссылки не определен:", r);
			return Html.a({href:rr.url}, rr.title)
		}
		return Html.a({href:r.url}, r.title)
	}
};

(function(){
	function $(id){return document.getElementById(id);}
	var extend = KB.Collections.extend;
	var each = KB.Collections.each;
	var filter = KB.Collections.filter;
	var count = KB.Collections.count;
	
	extend(KbView, {
		version: "1.20.83",
		animationTimeout: 1000,
		instances: [],
		
		getInstance: function(idx){
			return KbView.instances[idx];
		},
		
		init: function(){
			each(KbView.instances, function(inst){
				inst.displayMainView();
			});
		},
		
		addEventHandler: function(element, event, handler){
			if(element.addEventListener)
				element.addEventListener(event, handler, true);
			else
				element.attachEvent("on"+event, handler);
		},
		
		goToItem: function(idx, itmID, prevItmID){
			if(prevItmID){
				KbView.instances[idx].history.push(prevItmID);
			}
			var el = $(itmID+"d"+idx);
			if(!el) return;
			el.className+=" attention";
			window.setTimeout(function(){
				document.getElementById(itmID+"d"+idx).className = "itemName";
			}, KbView.animationTimeout);
			
			window.scrollTo(el.offsetLeft, el.offsetTop);
		},
		
		compareItems: function(idx){KbView.getInstance(idx).displayComparisonTable();},
		
		displayRelatedItems: function(idx){KbView.getInstance(idx).displayRelatedItems();},
		
		search: function(idx){
			var fld = $("searchField"+idx);
			var val = fld.value;
			if(!val.length)
				return;
			var kb = KbView.getInstance(idx).kb;
			var re = new RegExp(val, "ig");
			var items = filter(kb.items, function(itm){
				return itm.name.toLowerCase().match(re) || itm.id.toLowerCase().match(re);
			});
			
			var itemsFound = false;
			each(items, function(itm){
				KbView.goToItem(idx, itm.id);
				itemsFound = true;
			});
			
			fld.style.backgroundColor = itemsFound?"#ffffff":"#ff0000";
		},
		
		displayRelatedInstances: function(idx, itmId){KbView.instances[idx].displayRelatedInstances(itmId);},
		goBack: function(idx){KbView.instances[idx].goBack();},
		checkId: function(idx){KbView.instances[idx].checkId();},
		displayTree: function(idx, itemId, relType, inversion){KbView.instances[idx].displayTree(itemId, relType, inversion);},
		closeTree:function(idx, itemId){$("treeView"+idx+itemId).style.display = "none"},
		addToSelected: function(idx, itmId){KbView.instances[idx].addToSelected(itmId);},
		unselectItem: function(idx, itmId){KbView.instances[idx].unselectItem(itmId);},
		clearSelectedItems: function(idx){KbView.instances[idx].clearSelectedItems();}
	});
	
	extend(KbView.prototype, {
		history:new KB.Collections.Stack(),
		selectedItems:{},
		
		itemRefDisplay: function(itm, prevItmID){with(Html){var _=this;
			return span(
				{
					"class":typeof(itm)=="string"?"undefinedItem":"link", 
					onclick:
						typeof(itm)=="string"?
							null
							:callFunction("KbView.goToItem", _.idx, itm.id, prevItmID)
				}, 
				
				typeof(itm)=="string"?itm:itm.name
			);
		}},
		
		descriptionDisplay: function(dsc){with(Html){
			if(typeof(dsc)=="string") return p(dsc);
			return div(apply(dsc, function(el){
				return el.toString();
			}));
		}},
		
		propertyValueDisplay: function(v){with(Html){var _=this;
			if(!v) return "";
			if(typeof(v.min)!="undefined" || typeof(v.max)!="undefined")
				return span(
					typeof(v.min)!="undefined"?("от "+v.min):"",
					typeof(v.min)!="undefined"?(" до "+v.max):""
				);
			return v;
		}},
		
		itemDisplay: function(itm){with(Html){var _=this;
			function getRelType(id){return _.kb.relationTypes[id];}
			
			function relatedItemTemplate(inversion){
				return function(relList, nm){with(Html){
					var relType = getRelType(nm);
					if(!relType) return "";
					return span(
						span({"class":"link", style:"font-weight:bold;", onclick:callFunction("KbView.displayTree", _.idx, itm.id, inversion?relType.inversion:relType.name, inversion)},
							inversion?relType.inversion:relType.name
						),
						": ",
						apply(relList, function(rel, i){
							return span(
								i>0?", ":"",
								rel.truth==0?"не(":null,
								_.itemRefDisplay(inversion?rel.src:rel.trg, itm.id),
								rel.truth==0?")":null,
								rel.truth>0?span("(", rel.truth, ")"):null
							);
						}),
						"; "
					);
				}}
			}
			
			return div({"class":"itemPanel"},
				p({"class":"itemName"}, 
					span({"class":"link button", title:"back", onclick:callFunction("KbView.goBack", _.idx)}, "[&lt;]"), 
					a({name:itm.id},
						span({"class":"itemName", id:itm.id+"d"+_.idx}, itm.name),
						span({"class":"link button", title:"Добавить в запрос", onclick:callFunction("KbView.addToSelected", _.idx, itm.id)}, "[+]"),
						" ",
						itm.name!=itm.id?span({style:"font-size:90%; color:#888888;", title:"Internal item ID"}, "[",itm.id,"]"):null,
						": "
					),
					apply(itm.relationIndex, relatedItemTemplate(false)),
					apply(itm.backRelationIndex, relatedItemTemplate(true))
				),
				itm.properties?div({style:"margin-left:30px;"},
					table({border:0, cellpadding:3, cellspacing:0},
						apply(itm.properties, function(v, nm){
							return tr(th(nm), td(_.propertyValueDisplay(v)));
						})
					)
				):null,
				div({"class":"details"},
					itm.description?_.descriptionDisplay(itm.description):null,
					apply(itm.refs, function(ref, i){
						return span(
							i>0?", ":null,
							a({href:ref.url, target:"_blank"}, ref.title)
						);
					}),
					apply(itm.docs, function(doc, i){
						var d = typeof(doc)=="string"?KB.Article.items[doc]:doc;
						return p(
							a({href:d.url}, d.title)
						);
					})
				),
				div({id:"relatedItems"+_.idx+itm.id}, span({
					"class":"link button", 
					onclick:callFunction("KbView.displayRelatedInstances", _.idx, itm.id)
				}, "[show related items]")),
				div({id:"treeView"+_.idx+itm.id})
			);
		}},
		
		displayRelationTable: function(){with(Html){var _=this;
			return div({style:"border:1px solid black; margin:3px; padding:3px; background-color:#ffffff;"},
				p({style:"font-weight:bold; margin-bottom:10px;"}, "Defined relations:"),
				apply(_.kb.relationTypes, function(rel){
					return div({style:"margin-left:15px;"},
						span({style:"font-weight:bold;"}, rel.id), ": ",
						span({style:"color:#006600;"}, rel.name), "/", span({style:"color:#0000aa;"}, rel.inversion),
						rel.description? span({style:"font-style:italic; font-size:90%;"}, " - ", rel.description):null
					);
				})
			);
		}},
		
		displayRelatedInstances: function(itmId){with(Html){var _=this;
			var distTable = _.kb.getDistances(_.kb.items[itmId]);
			var distGroups = _.kb.groupDistances(distTable);
			var prevLevel = 1;
			var trgdiv = $("relatedItems"+_.idx+itmId);
			trgdiv.innerHTML = div(
				p({style:"font-weight:bold;"}, "Related items: "),
				div(
					ul({style:"margin-top:0px;"},
						apply(distGroups, function(grp, i){
							return li(
								apply(grp, function(iId, j){
									return (j>0?", ":"")+span({
										"class":"link",
										onclick:callFunction("KbView.goToItem", _.idx, iId, itmId)
									}, _.kb.items[iId]?_.kb.items[iId].name:iId);
								})
							);
						})
					)
				)
			);
			trgdiv.style.marginLeft = "10px";
		}},
		
		goBack:function(){var _=this;
			KbView.goToItem(_.idx, _.history.pop());
		},
		
		clearSelectedItems:function(){var _=this;
			_.selectedItems = {};
			_.displaySelectedItems();
		},
		
		displayMessage:function(msg, styleClass){var _=this;
			var attr = {};
			if(styleClass) attr["class"] = styleClass;
			$("message"+_.id).innerHTML = Html.span(attr, msg);
		},
		
		displayTree:function(itemId, relType, inversion){with(Html){var _=this;
			function nodeTemplate(nd){with(Html){
				return li(
					_.kb.items[nd.node]? span({"class":"link", onclick:callFunction("KbView.goToItem", _.idx, nd.node)}, _.kb.items[nd.node].name)
						:span({"class":"undefinedItem"}, nd.node),
					" ", (nd.truth!=null&&nd.truth!=1?span(" (", nd.truth,") "):""),
					span({"class":"link button", title:"Добавить в запрос", onclick:callFunction("KbView.addToSelected", _.idx, _.kb.items[nd.node].id)}, "[+]"),
					" ", nd.targets?span({style:"color:#888888;"}, relType):null,
					nd.targets?ul(
						apply(nd.targets, function(chld){
							return nodeTemplate(chld);
						})
					):null
				);
			}}
			
			var tree = _.kb.getRelationTree(itemId, relType, inversion);
			$("treeView"+_.idx+itemId).style.display = "block";
			$("treeView"+_.idx+itemId).innerHTML = div({style:"margin-top:5px;"},
				div({style:"margin-left:220px;"},
					span({"class":"link", onclick:callFunction("KbView.closeTree", _.idx, itemId)}, "[close]")
				),
				ul({style:"margin-top:0px;"}, nodeTemplate(tree))
			);
		}},
		
		checkId:function(){var _=this;
			var id = $("searchField"+_.idx).value;
			var free = true;
			each(_.kb.items, function(itm, itmId){
				if(id==itmId){
					_.displayMessage("Identifier "+id+" is assigned to item "+(itm.name), "messageFalse");
					free = false;
				}
			});
			if(free) _.displayMessage("Identifier "+id+" is free.", "messageTrue");
		},
		
		addToSelected: function(itmId){var _=this;
			_.selectedItems[itmId] = true;
			_.displaySelectedItems();
		},
		
		unselectItem: function(itmId){var _=this;
			_.selectedItems[itmId] = false;
			_.displaySelectedItems();
		},
		
		displaySelectedItems: function(){with(Html){var _=this;
			var selection = [];
			each(_.selectedItems, function(v, iId){if(v)selection.push(iId);});
			$("selectedItems"+_.idx).innerHTML = selection.length?div({style:"border:1px solid #aaaaaa; padding:3px; background-color:#fffff0;"},
				span({style:"font-weight:bold;"},"Selected: "),
				apply(selection, function(itmId, i){
					var itm = _.kb.items[itmId];
					return tagCollection(
						i>0?", ":"",
						span(itm.name),
						span({
							"class":"link button",
							title:"Unselect item",
							onclick:callFunction("KbView.unselectItem", _.idx, itm.id)
						}, "[-]")
					);
				}), " ",
				span({
					"class":"link button", 
					onclick:callFunction("KbView.clearSelectedItems", _.idx)
				}, "[clear]"), " ",
				span({
					"class":"link button",
					title:"Compare items",
					onclick:callFunction("KbView.displayRelatedItems", _.idx)
				}, "[display related items]"), " ",
				span({
					"class":"link button",
					title:"Compare items",
					onclick:callFunction("KbView.compareItems", _.idx)
				}, "[compare selected items]"),
				div({id:"relatedItems"+_.idx}),
				div({id:"comparisonTable"+_.idx})
			):null;
		}},
		
		displayRelatedItems: function(){with(Html){var _=this;
			$("relatedItems"+_.idx).innerHTML = "wait...";
			var selection = [];
			each(_.selectedItems, function(v, iId){if(v)selection.push(iId);});
			var distTable = _.kb.getNeighbors(selection);
			var distGroups = _.kb.groupDistances(distTable);
			$("relatedItems"+_.idx).innerHTML = div(
				div({style:"margin-top:5px;"},
					"Related items:",
					ul({style:"margin-top:0px; padding-top:0px;"},
						apply(distGroups, function(grp, i){
							if(!grp || !grp.length) return null;
							return li(apply(grp, function(iId, i){
								if(iId=="undefined") return "";
								return tagCollection(
									i>0?", ":"",
									span({
										"class":"link", title:"Go to item",
										onclick:callFunction("KbView.goToItem", _.idx, iId)
									}, _.kb.items[iId].name),
									span({
										"class":"link button", title:"Add to selected items",
										onclick:callFunction("KbView.addToSelected", _.idx, iId)
									}, "[+]")
								);
							}));
						})
					)
				)
			);
		}},
		
		displayComparisonTable: function(){with(Html){var _=this;
			function itemName(itmID){return _.kb.items[itmID].name;}
			
			var tblData = {cols:{}, rows:[]};
			each(_.selectedItems, function(isSelected, itmID){
				if(!isSelected) return;
				var itm = _.kb.items[itmID]; if(!itm) return;
				var data = {item:{id:itm.id, name:itm.name}, prop:{}, rel:{}, inv:{}};
				each(itm.properties, function(v, prNm){
					tblData.cols[prNm] = true;
					data.prop[prNm] = v;
				});
				each(itm.relations, function(rel){
					var rID = rel.type.name;
					tblData.cols[rID] = true;
					if(!data.rel[rID]) data.rel[rID] = [];
					data.rel[rID] = data.rel[rID].concat(rel);
				});
				each(itm.backRelations, function(rel){
					var rID = rel.type.inversion;
					tblData.cols[rID] = true;
					if(!data.inv[rID]) data.inv[rID] = [];
					data.inv[rID] = data.inv[rID].concat(rel);
				});
				tblData.rows.push(data);
			});
			
			var cols = [];
			apply(tblData.cols, function(v, nm){if(v) cols.push(nm)});
			cols.sort();
			tblData.cols = cols;
			
			$("comparisonTable"+_.idx).innerHTML = div(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						th(),
						apply(tblData.cols, function(colNm){
							return th(colNm);
						})
					),
					apply(tblData.rows, function(row){
						return tr(
							td(
								span({
									"class":"link", title:"Go to item",
									onclick:callFunction("KbView.goToItem", _.idx, row.item.id)
								}, row.item.name)
							),
							apply(tblData.cols, function(colNm){
								return td(
									row.prop[colNm]?_.propertyValueDisplay(row.prop[colNm]):null,
									apply(row.rel[colNm], function(el, i){
										return span(i>0?", ":"", 
											span({
												"class":"link", title:"Go to item",
												onclick:callFunction("KbView.goToItem", _.idx, el.trg.id)
											}, itemName(el.trg.id), (el.truth>=0&&el.truth<1?span(" (", el.truth, ")"):null))
										);
									}),
									apply(row.inv[colNm], function(el, i){
										return span(i>0?", ":"", 
											span({
												"class":"link", title:"Go to item",
												onclick:callFunction("KbView.goToItem", _.idx, el.src.id)
											}, itemName(el.src.id), (el.truth>=0&&el.truth<1?span(" (", el.truth, ")"):null))
										);
									})
								);
							})
						);
					})
				)
			);
		}},
		
		displayMainView: function(){with(Html){var _=this;			
			if(KB.compareVersions(KB.version, _.kb.requiredNacreVersion)<0)
				alert("Требуется библиотека KB версии не ниже "+_.kb.requiredNacreVersion+" (текущая версия "+KB.version+")");

				var relationsToUndefinedItems = filter(_.kb.relations, function(rel){
				return typeof(rel.trg)=="string";
			});
			
			$(_.panelID).innerHTML = div(
				h1(_.kb.name),
				p(
					input({type:"text", id:"searchField"+_.idx}),
					button({onclick:callFunction("KbView.search", _.idx)}, "Search"),
					button({onclick:callFunction("KbView.checkId", _.idx)}, "Check ID"),
					span({id:"message"+_.id, style:"margin-left:20px;"}),
					_.kb.errors.$count()?a({
						style:"background-color:yellow; padding-left:5px; padding-right:5px;",
						href:"#errorLog",
						title:"Обнаружены ошибки"
					}, "!"):null
				),
				div({id:"selectedItems"+_.idx}),
				apply(_.kb.items, function(itm){return _.itemDisplay(itm);}),
				
				KB.Article.items?div({style:"border:1px solid black; margin:3px; padding:3px; background-color:#fff"},
					div({style:"font-weight:bold"}, "BOOKS"),
					apply(KB.Article.items, function(b, id){
						return div(
							span({style:"color:#888;"}, "[",id ,"] "), a({href:b.url}, b.title)
						);
					})
				):null,
				
				_.displayRelationTable(),
				
				_.kb.errors.$count()? div({id:"errorLog", "class":"warning"},
					_.kb.errors.render(function(err){
						return p(
							span({style:"font-weight:bold;"}, err.type), ": ", span({style:"color:red;"}, err.message)
						);
					})
				):null,
				
				
				p({"class":"logo"},
					"Powered by Nacre KB v.", KB.version, ", ",
					"Nacre KbView v.", KbView.version
				)
			);
		}}
	});
})();


KbView.addEventHandler(window, "load", KbView.init);

