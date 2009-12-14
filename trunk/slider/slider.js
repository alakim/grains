function Slider(elID, settings){
	this.elID = elID;
	this.settings = settings;
	Slider.register(this);
}

Slider.version = "2.0.268";

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];};
	function each(coll, F){
		if(typeof(coll.length)=="string")
			for(var i=0; i<coll.length; i++) F(coll[i], i);
		else
			for(var k in coll) F(coll[k], k);
	}
	
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
	
	var instances = [];
	
	function capture(e){
		e = window.event || e;
		var t=this;
		targetObject=this;
		initMousePos = {x:e.clientX, y:e.clientY};
		initPos = {
			x:parseInt(t.offsetLeft), y:parseInt(t.offsetTop)
		};
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
		var res = {x:0, y:0};
		
		if(!settings.lockX){
			var dx = distance.x + initPos.x;
			if(settings.xRange!=null){
				res.x =	dx<settings.xRange.min?settings.xRange.min
					:dx>settings.xRange.max?settings.xRange.max
					:dx;
				if(dx>=settings.xRange.min && dx<= settings.xRange.max)
					targetObject.style.left = dx + "px";
			}
			else{
				targetObject.style.left = dx + "px";
				res.x = dx;
			}
		}
		if(!settings.lockY){
			var dy = distance.y + initPos.y;
			if(settings.yRange!=null){
				res.y = dy<settings.yRange.min?settings.yRange.min
					:dy>settings.yRange.max?settings.yRange.max
					:dy;
				if(dy>=settings.yRange.min && dy<=settings.yRange.max)
					targetObject.style.top  = dy + "px";
			}
			else{
				targetObject.style.top  = dy + "px";
				res.y = dy;
			}
		}
		
		if(settings.callback){
			var v = settings.lockX?res.y
				:settings.lockY?res.x
				:res;
			settings.callback(v);
		}
		return false;
	}

					
	function stop(){
		targetObject = null;
		document.onmousemove = null;
		document.onmouseup = null;
	}

	extend(__, {
		register: function(inst){
			inst.idx = instances.length;
			instances.push(inst);
		},
		
		init: function(){
			each(instances, function(inst){inst.init();});
		}
	});
	
	__.prototype = {
		init: function(){var _=this;
			var target = $(_.elID);
			_.settings = _.settings||{};
			target.sliderSettings = _.settings;
			
			target.onmousedown = capture;
			target.style.cursor = _.settings.lockY?"ew-resize":_.settings.lockX?"ns-resize":"move";
		}		
	};
	
	addEventHandler(window, "load", __.init);
	
})();
