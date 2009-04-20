if(typeof(Html)=="undefined")
	throw "Html module required. Chech html.js file.";
if(typeof(Html.tagCollection)=="undefined")
	throw "Module Html (version at least 1.6.*) required";
	
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
		return !(el.className && el.className.length>0)?false
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
	var items = new Registry();
	var layerCounter = 0;
	
	function domItemId(idx){
		return "DMenuItem"+idx;
	}
	
	function subMenuPanelId(idx){
		return domItemId(idx)+"pnl";
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
		version: "1.4.116",
		
		defaultTimeout:200,
		subMenuOffset:{x:-3, y:16},
		
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
			basic:{
				renderImage:function(itm){
					return !itm.img?null
						:Html.img({src:itm.img, style:"margin-right:5px;"});
				}
			},
			
			link:{
				render: function(menu, itm){
					itm.action = new Function("window.location.href = \""+itm.url+"\";");
					return __.item.action.render(menu, itm);
				}
			},
			
			action:{
				render: function(menu, itm){with(Html){
					items.register(itm);
					if(typeof(itm.action)=="string")
						itm.action = new Function(itm.action);
						
					return span({
						"class":"menuItem",
						onmouseover:"DMenu.item.action.mouseOver(this,"+menu.idx+", "+itm.idx+")",
						onmouseout:"DMenu.item.action.mouseOut(this,"+menu.idx+", "+itm.idx+")",
						onclick:"DMenu.item.action.click("+menu.idx+", "+itm.idx+")"
					}, __.item.basic.renderImage(itm), itm.name);
				}},
				
				mouseOver: function(el, menuIdx, itmIdx){
					__.highlightLink(el);
				},
				
				mouseOut: function(el, menuIdx, itmIdx){
					__.highlightLink(el, false);
				},
				
				click: function(menuIdx, itmIdx){
					items.get(itmIdx).action();
				}
			},
			
			disabledItem:{
				render: function(menu, itm){with(Html){
					return span({"class":"menuItem disabled"}, itm.name)
				}}
			},
			
			submenu:{
				render: function(menu, itm){with(Html){
					items.register(itm);
					return span({
						"class":"menuItem",
						onmouseover:"DMenu.item.submenu.mouseOver(this, "+menu.idx+", "+itm.idx+")",
						onmouseout:"DMenu.item.submenu.mouseOut(this, "+menu.idx+", "+itm.idx+")"
					}, __.item.basic.renderImage(itm), itm.name);
				}},
				
				mouseOver: function(el, menuIdx, itmIdx){
					__.item.submenuPanel.show(
						$(subMenuPanelId(itmIdx)),
						{
							x:el.offsetLeft + __.subMenuOffset.x, 
							y:el.offsetTop + __.subMenuOffset.y
						}
					);
				},
				
				mouseOut: function(el, menuIdx, itmIdx){
					__.item.submenuPanel.hide($(subMenuPanelId(itmIdx)));
				}
			},
			
			submenuPanel:{
				render: function(menu, itm){with(Html){
					return div({
						id:subMenuPanelId(itm.idx),
						"class":"submenupanel",
						style:"position:absolute; display:none;",
						onmouseover:"DMenu.item.submenuPanel.mouseOver(this)",
						onmouseout:"DMenu.item.submenuPanel.mouseOut(this)"
						},
						apply(itm.sub, function(nd){
							return div(
								nd.section?{"class":"newSection"}:null,
								nd.sub?tagCollection(
									__.item.submenu.render(menu, nd),
									__.item.submenuPanel.render(menu, nd)
								)
								:nd.url?__.item.link.render(menu, nd)
								:nd.action?__.item.action.render(menu, nd)
								:__.item.disabledItem.render(menu, nd)
							);
						})
					);
				}},
				
				mouseOver: function(el){
					el.visiblePanel = 1;
					removeCssClass(el, "oldPanel");
				},
				
				mouseOut: function(el){
					__.item.submenuPanel.hide(el);
				},
				
				show:function(el, pos){
					removeCssClass(el, "oldPanel");
					extend(el.style, {
						display: "block",
						top:pos.y+"px",
						left:pos.x+"px",
						zIndex:layerCounter++
					});
				},
				
				hide: function(el, afterDelay){
					afterDelay = afterDelay==null?false:afterDelay;
					
					if(!afterDelay){
						el.visiblePanel = 0;
						addCssClass(el, "oldPanel");
						window.setTimeout(function(){
							__.item.submenuPanel.hide(el, true);
						}, __.defaultTimeout);
					}
					else{
						if(el.visiblePanel==1)
							return;
						el.style.display = "none";
					}
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
					return mn.sub?tagCollection(
							__.item.submenu.render(_, mn),
							__.item.submenuPanel.render(_, mn)
						)
						:mn.url?__.item.link.render(_, mn)
						:mn.action?__.item.action.render(_, mn)
						:__.item.disabledItem.render(_, mn);
				})
			);
		}}
	});
	
	addEventHandler(window, "load", DMenu.init);
})();