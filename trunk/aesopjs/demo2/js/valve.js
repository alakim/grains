define(["jquery", "html", "raphael", "jspath", "aesop"], function($, $H, $R, $JP, $A){
	var width = 15;
	
	function Valve(x, y, isOpen){
		this.x = x;
		this.y = y;
		this.isOpen = isOpen || false;
		$A.classify(this);
	}
	$.extend(Valve.prototype, {
		perimeter: function(){var _=this;
			return [
				"M", _.x-width, _.y-width,
				"L", _.x+width, _.y-width,
				"L", _.x+width, _.y+width,
				"L", _.x-width, _.y+width,
				"Z"
			].join(" ");
		}
	});
	
	new $A.Class("Valve", function(inst){
		return inst.constructor == Valve;
	});
	
	
	$.extend(Valve.prototype, {
		view: function(cnv){var _=this;
			function attrs(isOpen){
				return {fill:isOpen?"#fff":"#ccc", stroke:"#008", cursor:"pointer"};
			}
			var lbl = cnv.text(_.x, _.y+width+10, _.isOpen?"open":"closed");
			cnv.circle(_.x, _.y, width)
				.attr(attrs(_.isOpen))
				.data({valveItem:_, label:lbl})
				.click(function(e){
					var valve = this.data("valveItem");
					valve.isOpen = !valve.isOpen;
					$A.classify(valve);
					this.attr(attrs(valve.isOpen));
					this.data("label").attr({text:valve.isOpen?"open":"closed"});
				});
			
		}
	});
	
	return Valve;
});