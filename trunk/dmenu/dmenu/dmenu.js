if(typeof(Html)=="undefined")
	throw "Html module required. Chech html.js file.";
if(typeof(Html.tagCollection)=="undefined")
	throw "Module Html version at least 1.6.* required";
	
function DMenu(panelId, structure){var _=this;
	_.structure = structure;
	_.panelId = panelId;
	DMenu.registerMenu(_);

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
		return 
			!el.className?false
			:contains(el.className.split(/\s+/), clNm);
	}
	
	function addCssClass(el, clNm){
		if(hasCssClass(el, clNm))
			return;
		el.className+=" "+clNm;
	}
	
	function removeCssClass(el, clNm){
		if(!el.className)
			return;
		var classes = [];
		each(el.className.split(/\s+/), function(cl){
			if(cl!=clNm)
				classes.push(cl);
		});
		el.className = classes.join(" ");
	}
	
	var __=DMenu;
	
	function Registry(){
		this.items = [];
	}
	
	extend(Registry.prototype, {
		register: function(itm){
			itm.idx = this.items.length;
			this.items.push(itm);
		},
		get:function(idx){
			return this.items[idx];
		},
		each:function(F){
			for(var i=0; i<this.items.length; i++){
				F(this.items[i], i);
			}
		}
	});
	
	var menus = new Registry();
	var domItems = new Registry();
	
	function domItemId(idx){
		return "DMenuItem"+idx;
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
		
		defaultTimeout:1000,
		
		init: function(){
			menus.each(function(mnu){
				mnu.render();
			});
		},
		
		registerMenu:function(menu){
			menus.register(menu);
		},
		
		highlightLink:function(el, on){
			on = on==null?true:on;
			if(on)
				addCssClass(el, "hiLink");
			else
				removeCssClass(el, "hiLink");
		},
		
		menuOn:function(el, idx, id){
			getInstance(idx).menuOn(el, id);
		},
		
		menuOff:function(el, idx, id){
			getInstance(idx).menuOff(el, id);
		},
		
		item:{
			link:{
				render: function(menu, itm){with(Html){
					domItems.register(itm);
					return span({"class":"menuItem", id:domItemId(itm.idx)},
						a({href:itm.url}, itm.nm)
					);
				}}
			},
			
			action:{
				render: function(menu, itm){with(Html){
					domItems.register(itm);
					return span({
						"class":"menuItem",
						onmouseover:"DMenu.item.action.mouseOver(this,"+menu.idx+", "+itm.idx+")",
						onmouseout:"DMenu.item.action.mouseOut(this,"+menu.idx+", "+itm.idx+")",
						onclick:"DMenu.item.action.click("+menu.idx+", "+itm.idx+")"
					}, itm.nm);
				}},
				
				mouseOver: function(el, menuIdx, itmIdx){
					__.highlightLink(el);
				},
				
				mouseOut: function(el, menuIdx, itmIdx){
					__.highlightLink(el, false);
				},
				
				click: function(menuIdx, itmIdx){
				}
			},
			
			disabledItem:{
				render: function(menu, itm){with(Html){
					return span({"class":"menuItem disabled"}, itm.nm)
				}}
			},
			
			submenu:{
				render: function(menu, itm){with(Html){
					domItems.register(itm);
					return span({
						"class":"menuItem",
						onmouseover:"DMenu.item.submenu.mouseOver("+menu.idx+", "+itm.idx+")",
						onmouseout:"DMenu.item.submenu.mouseOut("+menu.idx+", "+itm.idx+")"
					}, itm.nm);
				}},
				
				mouseOver: function(menuIdx, itmIdx){
					$(domItemId(itmIdx)+"pnl").style.display = "block";
				},
				
				mouseOut: function(menuIdx, itmIdx){
					$(domItemId(itmIdx)+"pnl").style.display = "none";
				}
			},
			
			submenuPanel:{
				render: function(menu, itm){with(Html){
					return div({
						id:domItemId(itm.idx)+"pnl",
						"class":"submenupanel",
						style:"position:absolute; display:none;",
						onmouseover:"DMenu.item.submenuPanel.mouseOver("+menu.idx+", "+itm.idx+")",
						onmouseout:"DMenu.item.submenuPanel.mouseOut("+menu.idx+", "+itm.idx+")"
						},
						apply(itm.sub, function(nd){return nd.nm;})
					);
				}},
				
				mouseOver: function(){
				},
				
				mouseOut: function(){
				}
			}
		}
	});
	
	extend(__.prototype, {
		idx:null,
		structure:null,
		panelId:null,
		items:[],
		
		$panel: function(){return $(this.panelId);},
		
		render: function(){with(Html){var _=this;
			_.$panel().innerHTML = div(
				{"class":"menupanel"},
				apply(_.structure, function(mn){
					return tagCollection(
						mn.sub?tagCollection(
							__.item.submenu.render(_, mn),
							__.item.submenuPanel.render(_, mn)
						)
						:mn.url?__.item.link.render(_, mn)
						:mn.act?__.item.action.render(_, mn)
						:__.item.disabledItem.render(_, mn)
					);
				})
			);
		}}
	});
	
	addEventHandler(window, "load", DMenu.init);
})();