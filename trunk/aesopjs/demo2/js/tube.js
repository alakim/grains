define(["jquery", "html", "raphael", "jspath", "aesop"], function($, $H, $R, $JP, $A){
	
	function Tube(src, dest, trace){
		this.src = src;
		this.dest = dest;
		this.trace = trace; // первый и последний элементы - положение портов 
							// вдоль периметра соединяемых элементов (по часовой стрелке)
							// между ними - длины отрезков
		$JP.set(src, "tubes/#*", this);
		$JP.set(dest, "tubes/#*", this);
		$A.classify(this);
	}
	
	new $A.Class("Tube", function(inst){
		return inst.constructor == Tube;
	});
	
	
	$.extend(Tube.prototype, {
		view: function(cnv){var _=this;
			var port1 = $R.getPointAtLength(_.src.perimeter(), _.trace[0]);
			var port2 = $R.getPointAtLength(_.dest.perimeter(), _.trace[_.trace.length-1]);
			var path = ["M", port1.x, port1.y];
			if(_.trace.length==2) path = path.concat([
				"L", port1.x+(port2.x-port1.x)/2, port1.y,
				"L", port1.x+(port2.x-port1.x)/2, port2.y
			]);
			path = path.concat(["L", port2.x, port2.y]);
			cnv.path(path).attr({"stroke-width":3, stroke:"#008"});
		}
	});
	
	return Tube;
});