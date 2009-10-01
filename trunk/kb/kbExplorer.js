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
		}
	});
	
	extend(KbExplorer.prototype, {
		
		displayMainView: function(){with(Html){var _=this;
			var relationsToUndefinedItems = filter(_.kb.relations, function(rel){
				return typeof(rel.trg)=="string";
			});
			
			$(_.panelID).innerHTML = div(
				h1(_.kb.name),
				p(
					input({type:"text", id:"searchField"+_.idx}),
					button({onclick:"KbExplorer.search("+_.idx+")"}, "Search")
				),
				
				relationsToUndefinedItems.length?
					div({"class":"warning"},
						span({"class":"subTitle"}, "Undefined items"),
						": ",
						apply(relationsToUndefinedItems, function(rel){
								return span({"class":"undefinedItem"},rel.trg);
						})
					)
					:null,
				
				p({"class":"logo"},
					"Powered by KB v.", KB.version, ", ",
					"KbExplorer v.", KbExplorer.version
				)
			);
		}}
	});
})();


KbExplorer.addEventHandler(window, "load", KbExplorer.init);

