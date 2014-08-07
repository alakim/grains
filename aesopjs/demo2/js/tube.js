define(["jquery", "html", "raphael", "jspath", "aesop"], function($, $H, $R, $JP, $A){
	
	function Tube(src, dest, trace){
		this.src = src;
		this.dest = dest;
		this.trace = trace;
		$JP.set(src, "tubes/#*", this);
		$JP.set(dest, "tubes/#*", this);
		$A.classify(this);
	}
	
	new $A.Class("Tube", function(inst){
		return inst.constructor == Tube;
	});
	
	$.extend(Tube.prototype, {
		view: function(cnv){
			
		}
	});
	
	return Tube;
});