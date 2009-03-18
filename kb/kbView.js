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

(function(){
	function $(id){return document.getElementById(id);}
	var extend = KB.Collections.extend;
	var each = KB.Collections.each;
	var filter = KB.Collections.filter;
	
	extend(KbView, {
		version: "1.1.89",
		animationTimeout: 1000,
		instances: [],
		
		getInstance: function(idx){
			return KbView.instances[idx];
		},
		
		init: function(){
			each(KbView.instances, function(inst){
				inst.kb.init();
				inst.displayMainView();
			});
		},
		
		addEventHandler: function(element, event, handler){
			if(element.addEventListener)
				element.addEventListener(event, handler, true);
			else
				element.attachEvent("on"+event, handler);
		},
		
		goToItem: function(idx, itmID){
			var el = $(itmID+"d"+idx);
			el.className+=" attention";
			window.setTimeout(function(){
				document.getElementById(itmID+"d"+idx).className = "itemName";
			}, KbView.animationTimeout);
			
			window.scrollTo(el.offsetLeft, el.offsetTop);
		},
		
		search: function(idx){
			var fld = $("searchField"+idx);
			var val = fld.value;
			if(!val.length)
				return;
			var kb = KbView.getInstance(idx).kb;
			var re = new RegExp(val, "gi");
			var items = filter(kb.items, function(itm){
				return itm.name.match(re);
			});
			
			var itemsFound = false;
			each(items, function(itm){
				KbView.goToItem(idx, itm.id);
				itemsFound = true;
			});
			
			fld.style.backgroundColor = itemsFound?"#ffffff":"#ff0000";
		}
	});
	
	extend(KbView.prototype, {
		
		itemDisplay: function(itm){with(Html){var _=this;
			return div({"class":"itemPanel"},
				p({"class":"itemName"}, 
					a({name:itm.id},
						span({"class":"itemName", id:itm.id+"d"+_.idx}, itm.name), ": "
					),
					apply(_.kb.getRelations(itm, false), function(rel, i){
						return span(
							i>0?", ":"",
							" ", 
							span({"class":"relation"}, rel.type.name,
								rel.truth?span(" (", rel.truth, ")"):null
							), 
							" ", 
							span({"class":"link", onclick:"KbView.goToItem("+_.idx+",'"+rel.trg.id+"')"}, rel.trg.name), 
							" "
						);
					}),
					
					apply(_.kb.getRelations(itm, true), function(rel, i){
						return span(
							i>0?", ":"",
							" ", 
							span({"class":"relation"},
								rel.type.inversion,
								rel.truth?span(" (", rel.truth, ")"):null
							), 
							" ", 
							span({"class":"link", onclick:"KbView.goToItem("+_.idx+",'"+rel.src.id+"')"}, rel.src.name), 
							" "
						);
					})
				),
				div({"class":"details"},
					itm.description?p(itm.description):null,
					apply(itm.refs, function(ref, i){
						return span(
							i>0?", ":null,
							a({href:ref.url, target:"_blank"}, ref.title)
						);
					})
				)
			);
		}},
		
		displayMainView: function(){with(Html){var _=this;
			$(_.panelID).innerHTML = div(
				h1(_.kb.name),
				p(
					input({type:"text", id:"searchField"+_.idx}),
					button({onclick:"KbView.search("+_.idx+")"}, "Search")
				),
				apply(_.kb.items, function(itm){return _.itemDisplay(itm);})
			);
		}}
	});
})();


KbView.addEventHandler(window, "load", KbView.init);

