var Slider = {};

Slider.version = "1.0.0";

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];};
	function $(id){return document.getElementById(id);}
	
	function addEventHandler(element, event, handler){
		if(element.addEventListener)
			element.addEventListener(event, handler, true);
		else
			element.attachEvent("on"+event, handler);
	}
	
	function Position(x,y){
		this.x = x?x:0;
		this.y = y?y:0;
	}
	
	Position.get = function(el){
		if(!el.style) return new Position();
		return new Position(
			parseInt(el.style.left),
			parseInt(el.style.top)
		);
	};
	
	Position.prototype = {
		set: function(el){
			el.style.left = this.x+"px";
			el.style.top = this.y+"px";
		},
		
		add:function(offset){
			return new Position(
				this.x+=offset.x,
				this.y+=offset.y
			);
		},
		
		sub:function(offset){
			return new Position(
				this.x-=offset.x,
				this.y-=offset.y
			);
		},
		
		offset: function(x, y){
			this.x+=(x||0);
			this.y+=(y||0);
		}
	};
	
	var __=Slider;
	
	
	extend(__, {
		init: function(targetObject){
			if(typeof(targetObject)=="string") targetObject = $(targetObject);
			
			function config(el, resizeMode){
				el.onmousedown = __.capture;
				el.style.cursor = "move";
			}
			
			config(targetObject);
		},
		
		moving:function(e){
			e = window.event || e;
			var targetObject = __.targetObject;
			
			__.distance = {
				x: e.clientX - __.initMousePos.x,
				y: e.clientY - __.initMousePos.y
			};
			
			targetObject.style.left = (__.distance.x + __.initPos.x) + "px";
			targetObject.style.top  = (__.distance.y + __.initPos.y) + "px";
			
			return false;
		},
		
		stop:function(){
			__.targetObject = null;
			document.onmousemove = null;
			document.onmouseup = null;
		},
		
		capture:function(e){
			e = window.event || e;
			var t=this;
			__.targetObject=this;
			__.initMousePos = {x:e.clientX, y:e.clientY};
			__.initPos = Position.get(t);
			document.onmousemove=__.moving;
			document.onmouseup=__.stop;
			return false;
		}
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
/*	var instances = [];
	
	extend(__, {
		captured:null,
		capturedPos:null,
		mousedown: function(e, el){
			e = window.event||e;
			__.capturedPos = new Position(e.clientX, e.clientY);
			var elPos = Position.get(el);
			__.capturedPos = elPos.sub(__.capturedPos);
			__.captured = el.slider;
		},
		mouseup: function(){__.captured = null;},
		mousemove: function(e){
			if(__.captured) __.captured.mousemove(window.event||e);
		}
	});
	
	__.prototype = {
		elID:null,
		id:null,
		$el: function(){return $(this.elID);},
		
		init:function(){var _=this;
			_.id = instances.length;
			instances.push(_);
			_.offset = new Position();
			_.scroll = new Position();
			
			_.$el().onmousedown = new Function("e", "Slider.mousedown(e, this);");
			_.$el().slider = _;
		},
		
		mousemove: function(e){var _=this;
			var pos = new Position(e.clientX-15, e.clientY-15);
			pos = pos.add(__.capturedPos);
			pos.set(_.$el());
		}
	};
	
	addEventHandler(document, "mousemove", __.mousemove);
	addEventHandler(document, "mouseup", __.mouseup);*/
})();
