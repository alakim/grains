define(["jquery", "html", "raphael", "aesop"], function($, $H, $R, $A){
	
	function Tank(name, x, y, level){var _=this;
		_.name = name;
		_.x = x;
		_.y = y;
		_.level = $A.property(_, level, function(t, v){
			$A.classify(_);
			console.log("Is"+($A.getFacet(_, "FullTank")?"":" not")+" full tank with level "+_.level());
		});
		_.width = 40;
		_.height = 80;
		$A.classify(_);
	}
	$.extend(Tank.prototype, {
		perimeter: function(){var _=this;
			return [
				"M", _.x, _.y,
				"L", _.x+_.width, _.y,
				"L", _.x+_.width, _.y+_.height,
				"L", _.x, _.y+_.height,
				"Z"
			].join(" ");
		}
	});
	
	new $A.Class("Tank", function(inst){
		return inst.constructor == Tank;
	});
	
	new $A.Class("FullTank", function(inst){
		var fc = $A.getFacet(inst, "Tank");
		return fc!=null && inst.level()>.75;
	});

	$.extend(Tank.prototype, {
		view: function(cnv){var _=this;
			cnv.rect(_.x, _.y, _.width, _.height).attr({fill:"#8ef", stroke:"#008"});
			cnv.rect(_.x, _.y+(_.height*(1-_.level())), _.width, _.height*_.level()).attr({fill:"#00a", stroke:"#008"});
			if($A.getFacet(_, "FullTank"))
				cnv.circle(_.x+15, _.y+_.height-15, 8).attr({fill:"#f00"});
		}
	});
	
	return Tank;
});