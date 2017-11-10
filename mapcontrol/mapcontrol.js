var MapControl = (function($, $C, $S){$H=$C.simple;
	var px = $C.css.unit.px,
		css = $C.css.keywords;

	var uid = (function(){
		var counter = 0;
		return function(){
			return counter++;
		};
	})();
	
	function MapControl(pnl, mapImage){pnl=$(pnl);
		var ctrlID = 'mapControl'+uid();
		var control = $C.html.svg({
			'class':'mapControl',
			id:ctrlID,
			style:$C.formatStyle({
				width:600,
				height:600,
				border: $C.css.template.border(1, '#ccc')
			})
		});
		pnl.append(control);
		var s = $S('#'+ctrlID);
		s.image(mapImage, 0, 0, pnl.width());
		var pos = pnl.position();
		var point = s.circle(100, 100, 5)
			.attr({
				fill:'#f00',
				cursor:css.pointer
			})
			.drag(function(dx, dy, x, y){
				console.log('move %s, %s', x, y);
				point.attr({
					cx: x-pos.left,
					cy: y-pos.top
				});
			}, function(x, y){
				console.log('start %s, %s', x, y);
				
			}, function(x, y){
				console.log('end %s, %s', x, y);
				
			});
		;
	}


	return MapControl;
})(jQuery, Clarino.version('1.1.0'), Snap);
