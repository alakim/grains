var DWL={
	version: "4.1.153",
	
	minSize:{w:150, h:100},
	
	$includePath: function(path){var _=DWL;
		if(path){
			_.__.includePath = path;
			_.loadGraphics();
		}
		return _.__.includePath;
	},
	
	locale:{
		minimize: "Свернуть",
		close: "Закрыть",
		restore: "Восстановить",
		pinOn:"Закрепить",
		pinOff:"Открепить",
		warning1: "Window has been closed, so no window to load contents into. Open/Create the window again.",
		warning2: "An error has occured somwhere inside your \"onclose\" event handler",
		warning3: "DHTML Window has been closed, so nothing to show. Open/Create the window again."
	},
	
	compareVersions: function(v1, v2){
		v1 = v1.split(".");
		v2 = v2.split(".");
		if(v1.length!=v2.length)
			throw "Version number has different dimensions";
		
		for(var i=0; i<v1.length; i++){
			var res = parseInt(v1[i]) - parseInt(v2[i]);
			if(res!=0)
				return res>0?1:-1;
		}
		return 0;
	},
	
	$:function(id){
		return document.getElementById(id);
	},
	
	$$:function(tagName, context, condition){
		context = context?context:document;
		var coll = context.getElementsByTagName(tagName);
		if(condition){
			var condF = new Function("el", "with(el){return "+condition+";}");
			var res = [];
			for(var i=0;i<coll.length;i++){
				var el = coll[i];
				if(condF(el))
					res.push(el);
			}
			return res;
		}
	},
	
	addEvent:function(target, functionref, tasktype){
		var tasktype=(window.addEventListener)? tasktype : "on"+tasktype;
		if (target.addEventListener)
			target.addEventListener(tasktype, functionref, false);
		else if (target.attachEvent)
			target.attachEvent(tasktype, functionref);
	},
	
	loadGraphics: function(str){var __=DWL.__;
		str = str?str:__.defaultImageFiles;
		for(var k in str){
			var img = new Image();
			img.src = __.includePath+"/"+str[k];
			__.images[k] = img;
		}
	},
	
	isIE: function(){
		return navigator.appName.match(/internet\s+explorer/i);
	},
	
	selectorLockMode:"substitute", //"off", "hide", "substitute"
	
	__:{
		minimizeorder: 0,
		zIndexvalue:100,
		tobjects: [], 
		lastactivet: {},
		
		images:{
		},
		
		includePath: "dwin",
		
		defaultImageFiles: {
			min:'min.gif',
			close:'close.gif',
			restore: 'restore.gif',
			resize: 'resize.gif',
			progressbar: "progressbar.gif",
			wait:"wait.gif",
			pinOn:"pinOn.gif",
			pinOff:"pinOff.gif"
		},
		
		buildWindow: function(bodyDiv, title, buttons, dlgButtons){var __=DWL.__;
			var dragHandlePadding = 0;
			if(buttons.pin)
				dragHandlePadding+=17;
			if(buttons.min)
				dragHandlePadding+=17;
			if(buttons.close)
				dragHandlePadding+=17;
			
			var bodyID = bodyDiv.id;
			var frmID = bodyID+"frm";
			if(bodyDiv.className=="DWLDragContentarea")
				return DWL.$(frmID);
			
			var bodyHtml = bodyDiv.innerHTML;
			bodyDiv.parentNode.removeChild(bodyDiv);
			buttons = buttons?buttons:{min:1, close:1};
			var domwindow=document.createElement("div");
			domwindow.id = frmID;
			domwindow.className="DWL";
			if(bodyDiv.id.match(new RegExp("^"+DWL.__.dynamicIDPrefix+"\\d+"))){
				domwindow.className+=" dynamic";
			}
			var html = [];
			html.push("<div class=\"DWLDragHandle\">");
				html.push("<div class=\"DWLTitle\" style=\"margin-right:"+dragHandlePadding+"px;\">");
				html.push(title?title:'DHTML Window ');
				html.push('</div>');
				html.push('<div class="DWLDragControls">');
					if(buttons.pin!=0)
						html.push('<img class="pinOn" src="'+__.images.pinOff.src+'" title="'+DWL.locale.pinOn+'" />');
					if(buttons.min!=0)
						html.push('<img src="'+__.images.min.src+'" title="'+DWL.locale.minimize+'" />');
					if(buttons.close!=0)
						html.push('<img src="'+__.images.close.src+'" title="'+DWL.locale.close+'" />');
				html.push('</div>');
			html.push('</div>');
			html.push('<div class="DWLDragContentarea" id="'+bodyID+'">');
			html.push(bodyHtml);
			html.push('</div>');
			html.push('<div class="DWLDragStatusarea"><div class="DWLDragResizearea" style="background: transparent url('+__.images.resize.src+') top right no-repeat;">&nbsp;</div></div>');
			html.push('</div>');
			domwindow.innerHTML = html.join("");
			DWL.$("DWLHolder").appendChild(domwindow)
			
			var t = DWL.$(frmID);
			
			if(dlgButtons){
				for(var i=0;i<dlgButtons.length;i++){
					var btn = dlgButtons[i];
					if(btn)
						DWL.__.addButton(t, btn.title, btn.id, btn.click);
				}
			}
			return t;
		},
		
		obtainWindowParts: function(wDiv){
			var divs=wDiv.getElementsByTagName("div");
			for (var i=0; i<divs.length; i++){
				if (/DWLDrag/.test(divs[i].className))
					wDiv[divs[i].className.replace(/DWLDrag/, "").toLowerCase()]=divs[i]
			}
		},
		
		rememberattrs:function(t){var _=DWL.__;
			_.getviewpoint()
			t.lastx=parseInt((t.style.left || t.offsetLeft))-_.scroll_left;
			t.lasty=parseInt((t.style.top || t.offsetTop))-_.scroll_top;
			t.lastwidth=parseInt(t.style.width);
		},
		
		getdistance:function(e){
			var d=DWL.__;
			var etarget=d.etarget;
			var e=window.event || e
			d.distancex=e.clientX-d.initmousex;
			d.distancey=e.clientY-d.initmousey;
			if (etarget.className.match(/^DWLDragHandle/))
				d.move(etarget._parent, e);
			else if (etarget.className=="DWLDragResizearea")
				d.resize(etarget._parent, e);
			return false;
		},
		
		getValue: function(attrs, name){
			var mt = attrs.match(new RegExp(name+"=([^,]+)", "i"));
			if(name=="pinButton")
				return mt? parseInt(mt[1]):0;
			if(/Button$/.test(name)){
				return mt? parseInt(mt[1]) : 1;
			}
			return mt? parseInt(mt[1]) : 0;
		},
		
		setupdrag:function(e){var d=DWL.__;
			
			var t=this._parent;
			d.etarget=this;
			var e=window.event || e;
			d.initmousex=e.clientX;
			d.initmousey=e.clientY;
			d.initx=parseInt(t.offsetLeft);
			d.inity=parseInt(t.offsetTop);
			d.width=parseInt(t.offsetWidth);
			d.contentheight=parseInt(t.contentarea.offsetHeight);
			document.onmousemove=d.getdistance;
			document.onmouseup=function(){
				d.stop();
			}
			return false;
		},
		
		setopacity:function(targetobject, value){
			var undef = "undefined";
			if (!targetobject){ return; }
			if (typeof targetobject.style.filter!=undef){
					   targetobject.style.filter="alpha(opacity="+value*100+")";
			}else if (typeof targetobject.style.MozOpacity!=undef){
					   targetobject.style.MozOpacity=value;
			}else if (typeof targetobject.style.opacity!=undef){
					   targetobject.style.opacity=value;
			}
		},
		
		setfocus:function(t){var _=DWL.__;
			if(t.childDialog){
				return;
			}
			_.zIndexvalue++;
			t.style.zIndex=_.zIndexvalue;
			t.isClosed=false;
			_.setopacity(_.lastactivet.handle, 0.5);
			_.setopacity(t.handle, 1);
			_.lastactivet=t;
		},
		
		stop:function(){
			DWL.__.etarget=null;
			document.onmousemove=null;
			document.onmouseup=null;
		},
		
		cleanup:function(){var D_=DWL.__;
			for (var i=0; i<D_.tobjects.length; i++){
				var oi = D_.tobjects[i];
				oi.handle._parent=oi.resizearea._parent=oi.controls._parent=null;
			}
			window.onload=null;
		},
		
		addButton:function(win, title, id, func){var _=DWL;
			function getPanel(){
				var pColl = _.$$("DIV", win, "className=='DWLDragButtonsarea'");
				if(pColl.length>0)
					return pColl[0];
				
				var statusbar = _.$$("DIV", win, "className=='DWLDragStatusarea'")[0];
				var pnl = document.createElement("DIV");
				win.insertBefore(pnl, statusbar);
				pnl.className = "DWLDragButtonsarea";
				return pnl;
			}
			
			var pnl = getPanel();
			
			var bt = document.createElement("INPUT");
			bt.type = "button";
			pnl.appendChild(bt);
			bt.value = title;
				
			if(typeof(func)=="function")
				bt.onclick = func;
			else if(typeof(func)=="string")
				bt.onclick = new Function(func);
				
			if(id)
				bt.id = id;
		},
		
		setSize:function(t, w, h){
			var w = Math.max(parseInt(w), DWL.minSize.w);
			t.style.width = w+"px";
			var dW = t.offsetWidth - w;
			if(dW > 0){
				t.style.width = t.offsetWidth+"px";
			}
			t.contentarea.style.height = Math.max(parseInt(h), DWL.minSize.h)+"px";
		},
		
		moveTo:function(t, x, y){var _=DWL.__;
			_.getviewpoint();
			t.style.left=(x=="middle")? _.scroll_left+(_.docwidth-t.offsetWidth)/2+"px" : _.scroll_left+parseInt(x)+"px";
			t.style.top=(y=="middle")? _.scroll_top+(_.docheight-t.offsetHeight)/2+"px" : _.scroll_top+parseInt(y)+"px";
		},
		
		isResizable:function(t, bol){
			t.statusarea.style.display=(bol)? "block" : "none";
			t.resizeBool=(bol)? 1 : 0;
		},
		
		isScrollable:function(t, bol){
			t.contentarea.style.overflow=(bol)? "auto" : "hidden";
		},
		
		getviewpoint:function(){var _=DWL.__;
			var ie=DWL.isIE();
			var domclientWidth=document.documentElement && parseInt(document.documentElement.clientWidth) || 100000;
			_.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body;
			_.scroll_top=(ie)? _.standardbody.scrollTop : window.pageYOffset;
			_.scroll_left=(ie)? _.standardbody.scrollLeft : window.pageXOffset;
			_.docwidth=(ie)? _.standardbody.clientWidth : (/Safari/i.test(navigator.userAgent))? window.innerWidth : Math.min(domclientWidth, window.innerWidth-16);
			_.docheight=(ie)? _.standardbody.clientHeight: window.innerHeight;
		},
		
		move:function(t, e){var D_=DWL.__;
			t.style.left=D_.distancex+D_.initx+"px";
			t.style.top=D_.distancey+D_.inity+"px";
		},
		
		resize:function(t, e){var D_=DWL.__;
			var w = Math.max(D_.width+D_.distancex, DWL.minSize.w);
			var h = Math.max(D_.contentheight+D_.distancey, DWL.minSize.h);
			DWL.setSize(t, w, h);
		},
		
		enablecontrols:function(e){var _=DWL.__;
			var reMin = new RegExp(DWL.locale.minimize, "i");
			var reClose = new RegExp(DWL.locale.close, "i");
			var reRestore = new RegExp(DWL.locale.restore, "i");
			var sourceobj=window.event? window.event.srcElement : e.target;
			if (reMin.test(sourceobj.getAttribute("title")))
				_.minimize(sourceobj, this._parent);
			else if (reRestore.test(sourceobj.getAttribute("title")))
				_.restore(sourceobj, this._parent);
			else if (reClose.test(sourceobj.getAttribute("title")))
				DWL.close(this._parent);
			else if (sourceobj.className=="pinOn")
				DWL.pin(sourceobj);
			else if (sourceobj.className=="pinOff")
				DWL.pin(sourceobj);
			return false;
		},
		
		minimize:function(button, t){var D_=DWL.__;
			if(t.childDialog){
				return;
			}
			D_.rememberattrs(t);
			button.setAttribute("src", D_.images.restore.src);
			button.setAttribute("title", DWL.locale.restore);
			t.state="minimized";
			t.contentarea.style.display="none";
			if(t.buttonsarea)
				t.buttonsarea.style.display="none";
			t.statusarea.style.display="none";
			if (typeof t.minimizeorder=="undefined"){
				D_.minimizeorder++;
				t.minimizeorder=D_.minimizeorder;
			}
			t.style.left="10px";
			t.style.width="200px";
			var windowspacing=t.minimizeorder*10;
			t.style.top=D_.scroll_top+D_.docheight-(t.handle.offsetHeight*t.minimizeorder)-windowspacing+"px";
		},
		
		restore:function(button, t){var D_=DWL.__;
			this.getviewpoint();
			button.setAttribute("src", D_.images.min.src);
			button.setAttribute("title", DWL.locale.minimize);
			t.state="fullview";
			t.style.display="block";
			t.contentarea.style.display="block";
			if(t.buttonsarea)
				t.buttonsarea.style.display="block";
			if (t.resizeBool)
				t.statusarea.style.display="block";
			t.style.left=parseInt(t.lastx)+D_.scroll_left+"px";
			t.style.top=parseInt(t.lasty)+D_.scroll_top+"px";
			t.style.width=parseInt(t.lastwidth)+"px";
		},
		
		dynamicIDPrefix: "dwlDiv",
		
		generateID: function(){var _=DWL.__.generateID;
			_.counter = _.counter==null?1:_.counter+1;
			return DWL.__.dynamicIDPrefix+(_.counter);
		},
		
		closeDynamics: function(currentDlg){_=DWL;
			var divs = _.$("DWLHolder").getElementsByTagName("DIV");
			for(var i=0; i<divs.length; i++){var d=divs[i];
				if(d!=currentDlg && d.className.match(/dynamic/) && !d.childDialog){
					d.close();
					_.__.closeDynamics(currentDlg);
					return;
				}
			}
		},
		
		contains: function(container, elem){
			return elem.tagName=="BODY"? false
				:elem.parentNode==container? true
				:container.parentNode==elem? false
				:DWL.__.contains(container, elem.parentNode);
		},
		
		lockExternalFields: function(dlg, lock){var _=DWL;
			if(!_.isIE() || _.selectorLockMode=="off") return;
			lock = lock==null?true:lock;
			if(!lock){
				var substColl = document.getElementsByTagName("SPAN");
				for(var i=0; i<substColl.length; i++){var el=substColl[i];
					if(el.className=="dwlsubst"){
						el.parentElement.removeChild(el);
					}
				}
			}
			var coll = document.getElementsByTagName("SELECT");
			for(var i=0; i<coll.length; i++){var el=coll[i];
				if(!lock){
					el.style.display = "";
				}
				else if(!_.__.contains(dlg, el) && el.style.display!="none"){
					if(_.selectorLockMode=="substitute"){
						var subst = document.createElement("SPAN");
						subst.className = "dwlsubst";
						el.parentNode.insertBefore(subst, el);
						if(el.selectedIndex>=0)
							subst.innerHTML = el.options[el.selectedIndex].innerHTML;
					}
					el.style.display = "none";
				}
			}
		}
	},
	
	init:function(divID, title, attr, options){var D=DWL, D_=D.__;
		var dlgButtons = options?options.buttons:null;
		
		var buttons = {
			min:D_.getValue(attr, "minButton"),
			close: D_.getValue(attr, "closeButton"),
			pin:D_.getValue(attr, "pinButton")
		};
		
		divID = typeof(divID)=="string"?divID:D_.generateID();
		
		var bodyDiv = D.$(divID);
		if(!bodyDiv){
			bodyDiv = document.createElement("DIV");
			bodyDiv.id = divID;
			DWL.$("DWLHolder").appendChild(bodyDiv);
		}
		
		t = D_.buildWindow(bodyDiv, title, buttons, dlgButtons);
		
		D.getTitleItem(divID).innerHTML = title;
		
		D_.obtainWindowParts(t);
		t.handle._parent=t
		t.handle.onmousedown=D_.setupdrag
		
		t.resizearea._parent=t
		t.resizearea.onmousedown=D_.setupdrag
		
		t.controls._parent=t
		t.controls.onclick=D_.enablecontrols
		
		t.activityDisplayMode = "onStatusBar";
		if(options&&options.activityDisplayMode)
			t.activityDisplayMode = options.activityDisplayMode;
		
		t.onclose=function(){return true}
		t.onmousedown=function(){D_.setfocus(this)}
		
		t.close=function(){DWL.close(this)}
		t.setSize=function(w, h){D_.setSize(this, w, h)}
		t.moveTo=function(x, y){D_.moveTo(this, x, y)}
		t.isResizable=function(bol){D_.isResizable(this, bol)}
		t.isScrollable=function(bol){D_.isScrollable(this, bol)}
		
		D_.tobjects.push(t);
		return t;
	},
	
	open:function(divID, title, attr, options){var _=DWL.__;
		title = title!=null?title:"";
		attr = attr!=null?attr:"";
		var parent = options?options.parent:null;
		
		var gVal = _.getValue;
		var t = DWL.init(divID, title, attr, options);
		t.style.display = "block";
		
		_.setfocus(t);
		var xpos=gVal(attr, "center")? "middle" : gVal(attr, "left");
		var ypos=gVal(attr, "center")? "middle" : gVal(attr, "top");
		
		t.isResizable(gVal(attr, "resize"));
		t.isScrollable(gVal(attr, "scrolling"));
		t.style.visibility="visible";
		t.style.display="block";
		t.contentarea.style.display="block";
		if(t.buttonsarea)
			t.buttonsarea.style.display="block";
		t.moveTo(xpos, ypos);
		
		if (t.state=="minimized" && t.controls.firstChild.title==DWL.locale.restore){
			t.controls.firstChild.setAttribute("src", _.images.min.src);
			t.controls.firstChild.setAttribute("title", DWL.locale.minimize);
			t.state="fullview";
		}
		
		t.setSize(gVal(attr, "width"), (gVal(attr, "height")));
		t.displayActivity = DWL.displayActivity;
		t.parentDialog = parent;
		if(parent)
			parent.childDialog = t;
		
		if(options&&options.fixed){
			t.className = t.className.replace("dynamic", "fixed");
		}
		_.closeDynamics(t);
		_.lockExternalFields(t, true);
		return t;
	},
	
	setSize: function(t, w, h){
		t.style.width = w+"px";
		if(t.offsetWidth - w > 30)
			t.style.width = t.offsetWidth+"px";
		t.contentarea.style.height = h+"px";
	},
	
	close:function(t){
		if(typeof(t)=="string"){
			t = DWL.$(t+"frm");
		}
		
		if(!t || t.childDialog){
			return;
		}
		
		if(t.parentDialog){
			t.parentDialog.childDialog = null;
			DWL.__.setfocus(t.parentDialog);
		}
		
		try{
			var closewinbol=t.onclose();
		}
		catch(err){
			var closewinbol=true;
		}
		finally{
			if (typeof closewinbol=="undefined"){
				alert(DWL.locale.warning2)
				var closewinbol=true
			}
		}
		if (closewinbol){
			if (t.state!="minimized")
				DWL.__.rememberattrs(t);
			
			t.style.display="none";
			t.isClosed=true;
		}
		
		if(t.id.match(new RegExp("^"+DWL.__.dynamicIDPrefix+"\\d")))
			if(t.parentNode)
				t.parentNode.removeChild(t);
		
		DWL.__.lockExternalFields(t, false);
		return closewinbol;
	},
	
	displayActivity: function(show){var _=this;
		var activityClass = "waiting";
		if(show){
			if(_.activityDisplayMode.match(/(header)|both/i))
				_.handle.className+=" "+activityClass;
			if(_.activityDisplayMode.match(/(statusbar)|both/i))
				_.statusarea.className+=" "+activityClass;
		}
		else{
			var re = new RegExp("\\b"+activityClass+"\\b", "g");
			_.handle.className = _.handle.className.replace(re, "");
			_.statusarea.className = _.statusarea.className.replace(re, "");
		}
	},
	
	pin:function(t){
		var frm = t.parentNode.parentNode.parentNode;
		switch(t.className){
			case "pinOn":
				t.className = "pinOff";
				t.title = DWL.locale.pinOff;
				t.src = DWL.__.images.pinOn.src;
				frm.className = frm.className.replace("dynamic", "fixed");
				break;
			case "pinOff":
				t.className = "pinOn";
				t.title = DWL.locale.pinOn;
				t.src = DWL.__.images.pinOff.src;
				frm.className = frm.className.replace("fixed", "dynamic");
				break;
			default:
				break;
		}
	},
	
	getTitleItem: function(dlgId){
		return DWL.$(dlgId+'frm').childNodes[0].childNodes[0];
	},
	
	getById: function(id){
		return DWL.$(id+"frm");
	},
	
	closeDialog: function(srcButton){
		srcButton = (srcButton && srcButton.tagName)?srcButton:this;
		var dlg = srcButton.parentNode.parentNode;
		dlg.close();
	}

}

DWL.addEvent(window, function(){DWL.loadGraphics();}, "load"); 

document.write('<div id="DWLHolder"><span style="display:none">.</span></div>');
window.onunload=DWL.__.cleanup;
DWL.addEvent(document, function(e){
	if(e.keyCode!=27)
		return;
	if(DWL.__.lastactivet && DWL.__.lastactivet.className){
		if(DWL.__.lastactivet.className.match(/fixed/))
			return;
		DWL.close(DWL.__.lastactivet);
	}
}, "keyup");

