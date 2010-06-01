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
	
	function createGroup(canvas){
		return function(){
			var nd = canvas.set();
			var grpStyle;
			var grpTransform;
			for(var i=0; i<arguments.length; i++){var arg = arguments[i];
				if(isRaphaelsObject(arg))
					nd.push(arg);
				else{
					if(arg.style) grpStyle = arg.style;
					if(arg.transform) grpTransform = arg.transform;
				}
			}
			if(grpStyle) setStyle(nd, grpStyle);
			if(grpTransform) applyTransformations(nd, grpTransform);
			return nd;
		}		
	}
	
	function isRaphaelsObject(nd){
		return nd!=null && nd[0]!=null && nd[0].raphael!=null;
	}
	
	var _={
		version:"1.1.308",
		Paper:function(x, y, w, h){
			var canvas = Raphael(x, y, w, h);
			
			this.svg =createGroup(canvas);
			this.g = createGroup(canvas);
			
			this.path = function(data){
				var p = canvas.path(data.d);
				if(data.style) setStyle(p, data.style);
				if(data.transform) applyTransformations(p, data.transform);
				return p;
			};
			
			this.text = createGroup(canvas);
			
			this.tspan = function(){
				var x = 0;
				var y = 0;
				var t = "";
				for(var i=0; i<arguments.length; i++){var arg = arguments[i];
					if(typeof(arg)=="string") t = arg;
					else{
						x = parseFloat(arg.x);
						y = parseFloat(arg.y);
					}
				}
				var txt = canvas.text(x, y, t)
				return txt;
			};
		}
		
	};
	
	
	return _;
})();