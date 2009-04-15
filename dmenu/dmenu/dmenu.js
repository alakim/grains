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
	
	var testMode = typeof(JSUnit)!="undefined" || typeof(Documentation)=="function";
	
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
	
	function hasCssClass(el, clNm){
		return contains(el.className.split(/\s+/), clNm);
	}
	
	function addCssClass(el, clNm){
		if(hasCssClass(el, clNm))
			return;
		el.className+=" "+clNm;
	}
	
	function removeCssClass(el, clNm){
		var classes = [];
		each(el.className.split(/\s+/), function(cl){
			if(cl!=clNm)
				classes.push(cl);
		});
		el.className = classes.join(" ");
	}
	
	var __=DMenu;
	
	var instances = [];
	
	function getInstance(idx){
		return instances[idx];
	}
	
	if(testMode){
		__.internal = {
			each: each,
			contains: contains,
			addCssClass:addCssClass,
			hasCssClass:hasCssClass,
			removeCssClass:removeCssClass
		};
	}
	
	extend(__, {
		version: "1.0.98",
		
		defaultTimeout:200,
		
		registerInstance:function(inst){
			inst.idx = instances.length;
			instances.push(inst);
		},
		
		init: function(){
			each(instances, function(mnu){
				mnu.render();
			});
		},
		
		highlightLink:function(el, on){
			on = on==null?true:on;
			if(on)
				addCssClass(el, "hiLink");
			else
				removeCssClass(el, "hiLink");
		},
		
		menuOn:function(el, idx, id, subId){
			getInstance(idx).menuOn(el, id, subId);
		},
		
		menuOff:function(el, idx, id, subId){
			getInstance(idx).menuOff(el, id, subId);
		}
	});
	
	extend(__.prototype, {
		idx:null,
		structure:null,
		panelId:null,
		panels:[],
		currentId:0,
		
		$panel: function(){return $(this.panelId);},
		
		render: function(){with(Html){var _=this;
			var subMenuCounter = 0;
			
			function menuItemTemplate(menuItem){
				return Html.span(
					{
						"class":"menuItem",
						onmouseover:"DMenu.menuOn(this, "+_.idx+", "+subMenuCounter+(menuItem.sub?(","+subMenuCounter):"")+")",
						onmouseout:"DMenu.menuOff(this, "+_.idx+", "+subMenuCounter+(menuItem.sub?(","+subMenuCounter):"")+")"
					}, 
					menuItem.nm
				);
			}
			
			function menuPanelTemplate(menuItem){with(Html){
				return div(
					{
						id:_.getSubMenuID(subMenuCounter),
						"class":"submenupanel",
						style:"position:absolute; display:none;",
						onmouseover:"DMenu.menuOn(this, "+_.idx+", "+subMenuCounter+")",
						onmouseout:"DMenu.menuOff(this, "+_.idx+", "+subMenuCounter+")"
					},
					apply(menuItem.sub, subMenuItemTemplate)
				)
			}}
			
			function subMenuItemTemplate(subMn){
				return Html.div(
					{
						"class":"menuItem",
						onmouseover:"DMenu.menuOn(this, "+_.idx+", "+subMenuCounter+")",
						onmouseout:"DMenu.menuOff(this, "+_.idx+", "+subMenuCounter+")"
					},
					subMn.nm
				);
			}
			
			_.$panel().innerHTML = div(
				{"class":"menupanel"},
				apply(_.structure, function(mn){
					if(mn.sub){
						subMenuCounter++;
						_.panels.push(subMenuCounter);
					}
					return tagCollection(
						menuItemTemplate(mn),
						mn.sub?menuPanelTemplate(mn):null
					);
				})
			);
		}},
		
		getSubMenuID: function(id){
			return "pnl"+this.idx+"_"+id;
		},
		
		menuOn: function(el, id, subId){var _=this;
			if(subId){
				_.openSubMenu(el, subId, true);
			}
			else
				__.highlightLink(el);
		},
		
		menuOff: function(el, id, subId){var _=this;
			// if(subId){
			// 	window.setTimeout(function(){
			// 		_.closeSubMenu(subId);
			// 	}, __.defaultTimeout);
			// }
			__.highlightLink(el, false);
		},
		
		openSubMenu: function(el, id, on){var _=this;
			on = on==null?true:on;
			
			var mnu = id<0?el:$(this.getSubMenuID(id));
			if(mnu){
				mnu.style.display = on?"block":"none";
				if(on){
					_.currentId = id;
					_.closePanels(id);
					extend(mnu.style, {
						top: el.offsetTop + 16+"px",
						left:el.offsetLeft - 3 +"px"
					});
				}
			}
		},
		
		closePanels: function(except){var _=this;
			each(_.panels, function(pnlId){
				if(pnlId!=except)
					_.closeSubMenu(pnlId);
			});
		},
		
		closeSubMenu: function(id){var _=this;
			_.openSubMenu(null, id, false);
		}
	});
	
	addEventHandler(window, "load", DMenu.init);
})();