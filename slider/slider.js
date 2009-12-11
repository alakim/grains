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
	
	var __=Slider;
	
	var distance;
	var initPos;
	var targetObject;
	var initMousePos;
	
	function capture(e){
		e = window.event || e;
		var t=this;
		targetObject=this;
		initMousePos = {x:e.clientX, y:e.clientY};
		initPos = {x:parseInt(t.style.left), y:parseInt(t.style.top)};
		document.onmousemove = moving;
		document.onmouseup = stop;
		return false;
	}

	function moving(e){
		e = window.event || e;
		
		distance = {
			x: e.clientX - initMousePos.x,
			y: e.clientY - initMousePos.y
		};
		
		var settings = targetObject.sliderSettings;
		if(!settings.lockX)
			targetObject.style.left = (distance.x + initPos.x) + "px";
		if(!settings.lockY)
			targetObject.style.top  = (distance.y + initPos.y) + "px";
		
		return false;
	}

					
	function stop(){
		targetObject = null;
		document.onmousemove = null;
		document.onmouseup = null;
	}

	extend(__, {
		init: function(target, settings){
			if(typeof(target)=="string") target = $(target);
			settings = settings||{};
			target.sliderSettings = settings;
			
			target.onmousedown = capture;
			target.style.cursor = settings.lockY?"ew-resize":settings.lockX?"ns-resize":"move";
		}		
	});
	
})();
