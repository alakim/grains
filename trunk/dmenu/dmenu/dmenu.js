if(typeof(Html)=="undefined")
	throw "Html module required. Chech html.js file.";
if(typeof(Html.tagCollection)=="undefined")
	throw "Module Html version at least 1.6.* required";
	
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
		version: "1.0.98",
		
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
		},
		
		openSubMenu:function(el, idx, id){
			__.getInstance(idx).openSubMenu(el, id);
		},
		
		closeSubMenu:function(el, idx, id){
			__.getInstance(idx).closeSubMenu(id);
		}
	});
	
	extend(__.prototype, {
		idx:null,
		structure:null,
		panelId:null,
		
		$panel: function(){return $(this.panelId);},
		
		render: function(){with(Html){var _=this;
			var subMenuCounter = 0;
			_.$panel().innerHTML = div(
				{"class":"menupanel"},
				apply(_.structure, function(mn){
					return tagCollection(
						span(
							{
								"class":"menuItem",
								onmouseover:mn.sub?"DMenu.openSubMenu(this, "+_.idx+", "+subMenuCounter+")":"DMenu.highlightLink(this)",
								onmouseout:mn.sub?"DMenu.closeSubMenu(this, "+_.idx+", "+subMenuCounter+")":"DMenu.highlightLink(this, false)"
							}, 
							mn.nm
						),
						mn.sub?
							div(
								{
									id:_.getSubMenuID(subMenuCounter++),
									"class":"submenupanel",
									style:"position:absolute; display:none;"
								},
								apply(mn.sub, function(subMn){
									return div(
										{
											onmouseover:"DMenu.openSubMenu(this, "+_.idx+", -1)",
											onmouseout:"DMenu.closeSubMenu(this, "+_.idx+", -1)"
										},
										subMn.nm
									);
								})
							)
							:null
					);
				})
			);
		}},
		
		getSubMenuID: function(id){
			return "pnl"+this.idx+"_"+id;
		},
		
		openSubMenu: function(el, id, on){
			on = on==null?true:on;
			var mnu = id<0?el:$(this.getSubMenuID(id));
			mnu.style.display = on?"block":"none";
			if(on){
				extend(mnu.style, {
					top: el.offsetTop + 16+"px",
					left:el.offsetLeft - 3 +"px"
				});
			}
		},
		
		closeSubMenu: function(id){
			this.openSubMenu(null, id, false);
		}
	});
	
	addEventHandler(window, "load", DMenu.init);
})();