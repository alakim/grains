define(["jquery", "html", "raphael", "aesop"], function($, $H, $R, $A){
	
	function Tank(name, x, y, level){
		this.name = name;
		this.x = x;
		this.y = y;
		this.level = level;
		$A.classify(this);
	}
	
	new $A.Class("Tank", function(inst){
		return inst.constructor == Tank;
	});

	$.extend(Tank.prototype, {
		view: function(cnv){var _=this;
			var w = 40, h = 80;
			cnv.rect(_.x, _.y, w, h).attr({fill:"#8ef", stroke:"#008"});
			cnv.rect(_.x, _.y+(h*(1-_.level)), w, h*_.level).attr({fill:"#00a", stroke:"#008"});
		}
	});
	
	return Tank;
});