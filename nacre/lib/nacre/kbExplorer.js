if(typeof(KB)=="undefined")
	alert("KB module required!");

if(typeof(Html)=="undefined")
	alert("Html module required!");

function KbExplorer(kb, panelID){
	this.idx = KbExplorer.instances.length;
	KbExplorer.instances.push(this);
	
	this.kb = kb;
	this.panelID = panelID;
}

(function(){
	function $(id){return document.getElementById(id);}
	var extend = KB.Collections.extend;
	var each = KB.Collections.each;
	var filter = KB.Collections.filter;
	
	extend(KbExplorer, {
		version: "1.0.0",
		animationTimeout: 1000,
		instances: [],
		
		getInstance: function(idx){
			return KbExplorer.instances[idx];
		},
		
		init: function(){
			each(KbExplorer.instances, function(inst){
				inst.displayMainView();
			});
		},
		
		addEventHandler: function(element, event, handler){
			if(element.addEventListener)
				element.addEventListener(event, handler, true);
			else
				element.attachEvent("on"+event, handler);
		},
		
		search: function(idx){KbExplorer.instances[idx].search();},
		displayItem: function(idx, nm){KbExplorer.instances[idx].displayItem(nm);}
	});
	
	extend(KbExplorer.prototype, {
		selectedItems:[],
		
		search: function(){var _=this;
			var searchValue = $("searchField"+_.idx).value;
			var re = new RegExp(searchValue, "ig");
			_.selectedItems = filter(_.kb.items, function(itm, nm){
				return itm.name.match(re) || nm.match(re);
			});
			
			_.displaySelectedItems();
		},
		
		displaySelectedItems: function(){with(Html){var _=this;
			$("selectedItems"+_.idx).innerHTML = div(
				apply(_.selectedItems, function(itm, nm){
					return span({"class":"KbExplorer SelectedItem", onclick:"KbExplorer.displayItem("+_.idx+", '"+nm+"')"}, itm.name);
				})
			);
		}},
		
		templates:{
			relationPath: function(itm, relType){with(Html){
				return div(
					apply(kb.getRelationPath(itm, relType), function(s, i){
						return span(
							i>0?span({style:"margin:3px;"}, relType):null,
							span({style:"color:red;"}, s?s.name:"NULL")
						);
					})					
				);
			}}
			
		},
		
		relationTree: function(relType, tree){with(Html){var _=this;
			if(!tree || !tree.length)
				return "";
			var nodeAttributes = {"class":"KbExplorer treeNode"};
			if(tree[0].name) nodeAttributes.onclick = "KbExplorer.displayItem("+_.idx+",'"+tree[0].id+"')";
			var nodeTitle = tree[0].name?tree[0].name:tree[0];
			return tagCollection(
				span(nodeAttributes, nodeTitle),
				tree[1] && tree[1].length?tagCollection(
					span({style:"margin:3px;"}, relType),
					ul({"class":"KbExplorer relationTree"},
						apply(tree[1], function(nd){
							return li(_.relationTree(relType, nd));
						})
					)
				):null
			);
		}},
		
		displayItem: function(nm){with(Html){var _=this;
			var itm = _.kb.items[nm];
			var relTypes = {};
			each(kb.getRelations(itm, false), function(rel){relTypes[rel.type.name] = true;});
			var relInversions = {};
			each(kb.getRelations(itm, true), function(rel){relInversions[rel.type.inversion] = true;});
			$("itemView"+_.idx).innerHTML = div(
				div({"class":"KbExplorer title"}, itm.name),
				itm.description?p(itm.description):null,
				div({"class":"KbExplorer section"}, 
					p({"class":"KbExplorer title"}, "Relations"),
					apply(relTypes, function(v, rT){
						return _.relationTree(rT, kb.getRelationTree(itm, rT, false));
					}),
					
					apply(relInversions, function(v, rT){
						return _.relationTree(rT, kb.getRelationTree(itm, rT, true));
					})		
				),
				itm.docs?div({"class":"KbExplorer section"}, 
					p({"class":"KbExplorer title"}, "Links"),
					apply(itm.docs, function(doc, i){
						return p(
							a({href:doc.url}, doc.title)
						);
					})
				):null
			);
		}},
		
		displayMainView: function(){with(Html){var _=this;
			$(_.panelID).innerHTML = div({"class":"KbExplorer MainView"},
				h1(_.kb.name),
				p(
					input({type:"text", id:"searchField"+_.idx}),
					button({onclick:"KbExplorer.search("+_.idx+")"}, "Search")
				),
				
				div({id:"selectedItems"+_.idx, style:"margin:5px; padding:5px;"}),
				
				_.kb.errors.$count()? div({"class":"warning"},
					_.kb.errors.render(function(err){
						return p(
							span({"class":"KbExplorer errorType"}, err.type), ": ", span({"class":"KbExplorer errorMessage"}, err.message)
						);
					})
				):null,
				div({id:"itemView"+_.idx, "class":"KbExplorer ItemView"}),
				
				p({"class":"logo"},
					"Powered by Nacre KB v.", KB.version, ", ",
					"Nacre KbExplorer v.", KbExplorer.version
				)
			);
		}}
	});
})();


KbExplorer.addEventHandler(window, "load", KbExplorer.init);

