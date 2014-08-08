define(["jquery", "html", "raphael", "aesop"], function($, $H, $R, $A){
	
	function Tank(name, x, y, level){var _=this;
		_.name = name;
		_.x = x;
		_.y = y;
		_.level = $A.property(_, level, function(t, v){
			$A.classify(_);
			// console.log("Is"+($A.getFacet(_, "FullTank")?"":" not")+" full tank with level "+_.level());
			_.view();
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
			if(!_.icon){ // первичное создание пиктограммы
				_.icon = {};
				_.icon.body = cnv.rect(_.x, _.y, _.width, _.height).attr({fill:"#8ef", stroke:"#008"});
				_.icon.filling = cnv.rect(_.x, _.y+(_.height*(1-_.level())), _.width, _.height*_.level()).attr({fill:"#00a", stroke:"#008"});
				_.icon.lamp = cnv.text(_.x+20, _.y+_.height-15, "FULL").attr({fill:"#f00", stroke:"#f00"});
				_.icon.label = cnv.text(_.x+_.width/2, _.y+_.height+15, _.name);
				
				if(!$A.getFacet(_, "FullTank")) _.icon.lamp.hide();
			}
			else{ // обновление пиктограммы
				if($A.getFacet(_, "FullTank")) _.icon.lamp.show();
				else _.icon.lamp.hide();
				_.icon.filling.attr({
					y: _.y+(_.height*(1-_.level())),
					height: _.height*_.level()
				});
			}
		}
	});
	
	return Tank;
});