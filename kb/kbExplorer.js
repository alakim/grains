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
			console.log("searching for "+searchValue);
			var re = new RegExp(searchValue, "ig");
			_.selectedItems = filter(_.kb.items, function(itm, nm){
				return itm.name.match(re) || nm.match(re);
			});
			
			_.displaySelectedItems();
		},
		
		displaySelectedItems: function(){with(Html){var _=this;
			$("selectedItems"+_.idx).innerHTML = div(
				apply(_.selectedItems, function(itm, nm){
					return span({"class":"kbExplorerSelectedItem", onclick:"KbExplorer.displayItem("+_.idx+", '"+nm+"')"}, itm.name);
				})
			);
		}},
		
		displayItem: function(nm){with(Html){var _=this;
			var itm = _.kb.items[nm];
			$("itemView"+_.idx).innerHTML = div(
				div(itm.name),
				div(
					p("Inheritance"),
					apply(kb.getRelationPath(itm, "is"), function(s, i){
						return span(
							i>0?" -> ":null,
							span({style:"color:red;"}, s?s.name:"NULL")
						);
					})
				)
			);
		}},
		
		displayMainView: function(){with(Html){var _=this;
			var relationsToUndefinedItems = filter(_.kb.relations, function(rel){
				return typeof(rel.trg)=="string";
			});
			
			$(_.panelID).innerHTML = div({"class":"KbExplorerMainView"},
				h1(_.kb.name),
				p(
					input({type:"text", id:"searchField"+_.idx}),
					button({onclick:"KbExplorer.search("+_.idx+")"}, "Search")
				),
				
				div({id:"selectedItems"+_.idx, style:"margin:5px; padding:5px;"}),
				
				relationsToUndefinedItems.length?
					div({"class":"warning"},
						span({"class":"subTitle"}, "Undefined items"),
						": ",
						apply(relationsToUndefinedItems, function(rel){
								return span({"class":"undefinedItem"},rel.trg);
						})
					)
					:null,
				div({id:"itemView"+_.idx, "class":"kbExplorerItemView"}),
				
				p({"class":"logo"},
					"Powered by KB v.", KB.version, ", ",
					"KbExplorer v.", KbExplorer.version
				)
			);
		}}
	});
})();


KbExplorer.addEventHandler(window, "load", KbExplorer.init);

