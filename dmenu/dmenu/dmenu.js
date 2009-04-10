if(typeof(Html)=="undefined")
	throw "Html module required. Chech html.js file.";
	
function DMenu(panelId, structure){var _=this;
	_.structure = structure;
	_.panelId = panelId;
	DMenu.registerInstance(_);
}

(function(){
	function $(id){return document.getElementById(id);}
	
	function each(coll, F){
		if(typeof(coll.length)=="undefined")
			for(var k in coll) F(coll[k], k)
		else
			for(var i=0; i<coll.length; i++)F(coll[i], i)
	}
	
	function contains(arr, val){
		for(var i=0; i<arr.length; i++){
			if(arr[i]==val)
				return true;
		}
		return false;
	}
	
	function addEventHandler(trgEl, eventNm, handler){
		var eventNm=(window.addEventListener)? eventNm : "on"+eventNm;
		if (trgEl.addEventListener)
			trgEl.addEventListener(eventNm, handler, false);
		else if (trgEl.attachEvent)
			trgEl.attachEvent(eventNm, handler);
	}
	
	function extend(o, s){for(var k in s) o[k] = s[k];}
	
	var __=DMenu;
	
	var instances = [];
	
	extend(__, {
		version: "1.0.0",
		
		getInstance:function(idx){
			return instances[idx];
		},
		
		registerInstance:function(inst){
			inst.idx = instances.length;
			instances.push(inst);
		},
		
		init: function(){
			each(instances, function(mnu){
				mnu.render();
			});
		},
		
		css:{
			addClass:function(el, clNm){
				if(contains(el.className.split(/\s+/), clNm))
					return;
				el.className+=" "+clNm;
			},
			
			removeClass:function(el, clNm){
				var classes = [];
				each(el.className.split(/\s+/), function(cl){
					if(cl!=clNm)
						classes.push(cl);
				});
				el.className = classes.join(" ");
			}
		},
		
		highlightLink:function(el, on){
			on = on==null?true:on;
			if(on)
				__.css.addClass(el, "hiLink");
			else
				__.css.removeClass(el, "hiLink");
		}
	});
	
	extend(__.prototype, {
		idx:null,
		structure:null,
		panelId:null,
		
		$panel: function(){return $(this.panelId);},
		
		render: function(){with(Html){var _=this;
			_.$panel().innerHTML = div(
				{"class":"menupanel"},
				apply(_.structure, function(mn){
					return span(
						{
							"class":"menuItem",
							onmouseover:"DMenu.highlightLink(this)",
							onmouseout:"DMenu.highlightLink(this, false)"
						}, 
						mn.nm
					);
				})
			);
		}}
	});
	
	addEventHandler(window, "load", DMenu.init);
})();