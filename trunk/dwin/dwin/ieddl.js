if(typeof(Html)=="undefined")
	throw "Module html.js required for using IEDDL."

var IEDDL = {};

(function(){
	var testMode = typeof(JSUnit)=="object" || typeof(Documentation)=="function";
	
	function $(id){return document.getElementById(id);}
	function $$(tagName, root, condition){
		root = root?root:document;
		var coll = root.getElementsByTagName(tagName);
		if(condition)
			coll = filter(coll, condition);
		return coll;
	}
	
	function each(coll, F){
		for(var i=0; i<coll.length; i++){
			if(F(coll[i], i)==false)
				break;
		}
	}
	
	function getConditionFunction(condition){
		if(typeof(condition)=="string")
			condition = new Function("el", "with(el){return "+condition+";}");
		return condition;
	}
	
	function find(coll, condition){
		condition = getConditionFunction(condition);
		for(var i=0; i<coll.length; i++){
			var el = coll[i];
			if(condition(el))
				return el;
		}
		return null;
	}
	
	function filter(coll, condition){
		condition = getConditionFunction(condition);
		var res = [];
		each(coll, function(el){
			if(condition(el))
				res.push(el);
		});
		return res;
	}
	
	if(testMode){
		IEDDL.internals = { each:each, find:find, filter:filter, $:$, $$:$$, extend:extend};
	}
	
	function addEventHandler(element, event, handler){
		if(element.addEventListener)
			element.addEventListener(event, handler, true);
		else
			element.attachEvent("on"+event, handler);
	}
	
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var _ = IEDDL;
	function buildListPanel(){
		var div = document.createElement("DIV");
		document.body.appendChild(div);
		div.id="ieddlSelLst";
		extend(div.style, {
			zIndex:9000,
			display:"none",
			backgroundColor:"#ffffff",
			borderWidth:"1px",
			borderStyle:"solid",
			borderColor:"#000000",
			margin:"0px",
			position:"absolute"
		});
	}
	
	function configWindow(){
		addEventHandler(document, "click", IEDDL.closeAll);
	}
	
	function getOption(ddl, val){
		var opt = find(ddl.options, function(el){
			return el.value==val;
		});
		return opt?opt.innerText:"";
	}
	
	function replaceSimpleDDL(el){with(Html){
		var val = getOption(el, el.value);
		if(val=="")
			val = "&nbsp;";
		var html = div(
			{
				"class":"ieddlfld",
				onclick:"IEDDL.events.openList('"+el.name+"')",
				style:"cursor:default; width:"+el.style.width+"; height:9px; background-color:white; border:1px solid #7F9DB9;"
			},
			table({border:0, width:"100%", cellPadding:0, cellSpacing:0},
				tr(
					td({"class":"ieddlfld"},
						span({"class":"ieddlfld", style:"padding-left:4px;", id:"tb_"+el.name}, val)
					),
					td({width:17, height:19},
						img({"class":"ieddlfld", src:IEDDL.imagePath, width:17, height:19, border:0})
					)
				)
			)
		);
		
		el.style.display = "none";
		el.outerHTML = html+el.outerHTML;
	}}
	
	function replaceMultilineDDL(el){with(Html){
		el.style.display = "none";
		var pnl = document.createElement("DIV");
		el.parentNode.insertBefore(pnl, el);
		pnl.id = "mb_"+el.name; 
		pnl.className = "ieddlfld";
		extend(pnl.style, {
			cursor:"default",
			overflowY:"auto",
			padding:"1px",
			width:el.style.width,
			height:el.style.height,
			backgroundColor:"white",
			borderWidth:"1px",
			borderStyle:"solid",
			borderColor:"#7F9DB9"
		});
		
		fillMultilineDDL(el);
	}}
	
	function fillMultilineDDL(el){with(Html){
		var html = el.options.length==0?"&nbsp;"
			:apply(el.options, function(opt, i){
				return Html.div({
					id:"mb_"+el.name+"_"+opt.value,
					style:"cursor:default; width:100%; padding-left:3px;",
					onmouseover:"IEDDL.events.multilineDDL.mouseover(this)",
					onmouseout:"IEDDL.events.multilineDDL.mouseout(this)",
					onclick:"IEDDL.events.multilineDDL.click('"+el.id+"', '"+opt.value+"')"
				}, opt.innerHTML);
			});
		$("mb_"+el.name).innerHTML = html;
	}}
	
	function moveLst(divId, anchorId, offsetX, offsetY){
		var pos = getAnchorPosition(anchorId);
		var o = $(divId);
		var offX = offsetX!=null?offsetX:0;
		var offY = offsetY!=null?offsetY:0;
		if(o.style) extend(o.style, {
			left: pos.x + offX,
			top: pos.y + offY
		});
	}
	
	function getAnchorPosition(ancId){
		function getPageOffsetLeft(el){
			var ol=el.offsetLeft;
			while((el=el.offsetParent) != null){
				ol += el.offsetLeft;
			}
			return ol;
		}
		
		function getPageOffsetTop(el){
			var ot=el.offsetTop;
			while((el=el.offsetParent) != null){
				ot += el.offsetTop;
				if(!el.tagName.match(/body/i) && el.scrollTop!=0){
					ot-=el.scrollTop;
				}
			}
			return ot + 4;
		}
		
		var anc = $(ancId);
		return anc==null?{x:0, y:0}
			:{
				x: getPageOffsetLeft(anc),
				y: getPageOffsetTop(anc)
			};
	}
	
	function getSelectElement(selId){
		var sel = $(selId);
		return sel?sel
			: find(document.getElementsByTagName("select"), function(el){return el.name==selId;});
	}
	
	function resetMultilineDisplay(selId){
		each($$("DIV", $("mb_"+selId)), function(el){
			if(el.id.match("mb_"+selId)){
				el.checked = false;
				el.style.backgroundColor = "white";
			}
		});
	}
	
	extend(_,{
		version: "1.1.123",
		imagePath: "ddl.gif",
		enabled:window.navigator.userAgent.match(/MSIE/i) && !(window.navigator.userAgent.match(/Opera/i)),
		
		init:function(){
			if(!_.enabled) return;
			buildListPanel();
			configWindow();
			_.replaceDDLs();
		},
		
		events:{
			openList: function(selId){
				var selLst = $("ieddlSelLst");
				if(selLst.style.display!="none"){
					selLst.style.display = "none";
					return;
				}
				
				var sel = getSelectElement(selId);
				selLst.innerHTML = Html.apply(sel.options, function(opt, i){
					var val = opt.value;
					if(val.match(/\"/ig))
						val = val.replace(/\"/ig, "\\x22")
					return Html.div({
						style:"cursor:default; width:100%; padding-left:3px;",
						onmouseover:"IEDDL.events.simpleDDL.mouseover(this)",
						onmouseout:"IEDDL.events.simpleDDL.mouseout(this)",
						onclick:"IEDDL.events.simpleDDL.click('"+selId+"', '"+val+"')"
					}, opt.innerText);
				});
				
				moveLst("ieddlSelLst", "tb_"+selId, 0, 20);
				extend(selLst.style, {width: sel.style.width, display:"block"});
			},
			
			simpleDDL:{
				mouseover:function(el){
					el.style.backgroundColor = "#B2B4BF";
				},
				mouseout:function(el){
					el.style.backgroundColor = "white";
				},
				click:function(selId, val){
					var sel = getSelectElement(selId);
					sel.value = val;
					var tb = $("tb_"+selId);
					
					each(sel.options, function(el){
						if(el.value==val){
							tb.innerText = el.innerText;
							return false;
						}
						return true;
					});
					
					if(sel.onchange!=null)
						sel.onchange();
						
					$('ieddlSelLst').style.display = "none";
				}
			},
			
			multilineDDL:{
				mouseover:function(el){
					el.style.backgroundColor=el.checked?"#B2B4BF":"#EEEEEE"; 
				},
				mouseout:function(el){
					el.style.backgroundColor=el.checked?"#B2B4BF":"white";
				},
				click:function(selId, val){
					var sel = getSelectElement(selId);
					sel.value = val;
					_.syncDisplay(selId);
					
					if(sel.onchange!=null)
						sel.onchange();
					$('ieddlSelLst').style.display = "none";
				}
			}
		},
		
		syncMultilineDisplay: function(selId){
			var sel = getSelectElement(selId);
			var idx = sel.selectedIndex;
			if(idx>=0 && sel.options[idx]!=null){
				var txt = sel.options[idx].text;
				var dspl = $("mb_"+selId+"_"+sel.value);
				resetMultilineDisplay(selId);
				if(dspl!=null){
					dspl.checked = true;
					dspl.style.backgroundColor = "#B2B4BF";
				}
			}
		},
		
		syncDisplay:function(selId){
			var dspl = $("tb_"+selId);
			if(dspl==null)
				_.syncMultilineDisplay(selId);
			else{
				var sel = getSelectElement(selId);
				var idx = sel.selectedIndex;
				if(idx>=0 && sel.options[idx]!=null)
					dspl.innerText = sel.options[idx].text;
			}
		},
		
		replaceDDL:function(el){
			if(!_.enabled) return;
			
			if(typeof(el)=="string") el = $(el);
			if(el.size==0)
				replaceSimpleDDL(el);
			else
				replaceMultilineDDL(el);
		},
		
		replaceDDLs:function(root){
			if(!_.enabled) return;
			
			root = root?root:document;
			each(root.getElementsByTagName("SELECT"), function(el){
				_.replaceDDL(el);
			});
			
		},
		
		updateMultilineDDL: function(el){
			if(typeof(el)=="string") el = $(el);
			fillMultilineDDL(el);
		},
		
		showDDL: function(selId, show){
			var dspl = $("tb_"+selId);
			if(dspl)
				dspl.style.display = show?"block":"none";
		},
		
		showMultilineDDL: function(selId, show){
			var dspl = $("mb_"+selId);
			if(dspl)
				dspl.style.display = show?"block":"none";
		},
		
		closeAll: function(){
			if(event.srcElement.className=="ieddlfld")
				return;
			var lst = $("ieddlSelLst");
			if(lst) lst.style.display = "none";
		}
	});
	
	addEventHandler(window, "load", IEDDL.init);
})();

