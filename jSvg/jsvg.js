if(typeof(Raphael)!="function") alert("Configuration error!\nRaphael module required!");

var JSVG = (function(){
	var paper;
	var pos;
	
	function setStyle(nd, styleString){
		var styles = styleString.split(";");
		for(var i=0; i<styles.length; i++){var nmVal = styles[i];
			var nmVal = nmVal.split(":");
			nd.attr(nmVal[0], nmVal[1]);
		}
	}
	
	function applyTransformations(nd, trsf){
		if(!trsf) return;
		if(trsf.translate) nd.translate(trsf.translate.x || 0, trsf.translate.y || 0);
		if(trsf.rotate){
			if(typeof(trsf.rotate.isAbsolute)=="boolean")
				nd.rotate(trsf.rotate.degree, trsf.rotate.isAbsolute)
			else if(typeof(trsf.rotate.cx)=="number" &&typeof(trsf.rotate.cy)=="number")
				nd.rotate(trsf.rotate.degree, trsf.rotate.cx, trsf.rotate.cy);
		}
		if(trsf.scale){
			nd.scale(
				trsf.scale.xTimes,
				trsf.scale.yTimes,
				trsf.scale.centerX,
				trsf.scale.centerY
			);
		}
	}
	
	function assignEventHandlers(nd, events){
		if(!events) return;
		for(var k in events) nd[k](events[k](nd));
	}
	
	function createGroup(canvas){
		return function(){
			var nd = canvas.set();
			var grpStyle;
			var grpTransform;
			var events;
			for(var i=0; i<arguments.length; i++){var arg = arguments[i];
				if(isRaphaelsObject(arg)){
					nd.push(arg);
				}
				else{
					if(arg.id) nd.id = arg.id;
					if(arg.style) grpStyle = arg.style;
					if(arg.transform) grpTransform = arg.transform;
					if(arg.events) events = arg.events;
				}
			}
			if(grpStyle) setStyle(nd, grpStyle);
			if(grpTransform) applyTransformations(nd, grpTransform);
			if(events) assignEventHandlers(nd, events);
			return nd;
		}		
	}
	
	function isRaphaelsObject(nd){
		return nd!=null && nd[0]!=null && nd[0].raphael!=null;
	}
	
	var _={
		version:"1.3.312",
		Paper:function(x, y, w, h){
			var canvas = Raphael(x, y, w, h);
			
			this.svg =createGroup(canvas);
			this.g = createGroup(canvas);
			
			this.path = function(data){
				var p = canvas.path(data.d);
				if(data.id) p.id = data.id;
				if(data.style) setStyle(p, data.style);
				if(data.transform) applyTransformations(p, data.transform);
				if(data.events) assignEventHandlers(p, data.events);
				return p;
			};
			
			this.text = function(){
				var x = 0;
				var y = 0;
				var t = "";
				var style = "";
				var transform, events;
				for(var i=0; i<arguments.length; i++){var arg = arguments[i];
					if(typeof(arg)=="string") t = arg;
					else{
						x = parseFloat(arg.x);
						y = parseFloat(arg.y);
						style = arg.style;
						transform = arg.transform;
						events = arg.events;
					}
				}
				var txt = canvas.text(x, y, t);
				setStyle(txt, style);
				if(transform) applyTransformations(txt, transform);
				if(events) assignEventHandlers(txt, events);
				return txt;
			};
		}
		
	};
	
	
	return _;
})();