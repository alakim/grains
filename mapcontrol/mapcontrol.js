var MapControl = (function($, $C, $S){$H=$C.simple;
	var px = $C.css.unit.px,
		css = $C.css.keywords,
		$T = $C.css.template;

	var size = {w:300, h:300};

	$C.css.writeStylesheet({
		'.mapControlFrame':{
			border:$T.border(1, '#f00'),
			width:px(size.w),
			height:px(size.h)
		}
	});

	var uid = (function(){
		var counter = 0;
		return function(){
			return counter++;
		};
	})();
	
	function MapControl(options){
		console.assert(options.field&&options.field.length, 'Missing options.field value.');
		console.assert(options.maps&&options.maps.length, 'Missing options.map collection.');
		var field = $(options.field);
		var pnl = $($H.div({'class':'mapControlFrame'}));
		field.after(pnl);
		if(options.size) size = options.size;
		pnl.css({
			width:px(size.w),
			height:px(size.h)
		});

		var ctrlID = 'mapControl'+uid();
		var control = $C.html.svg({
			'class':'mapControl',
			id:ctrlID,
			style:$C.formatStyle({
				width:size.w,
				height:size.h,
				border: $C.css.template.border(1, '#ccc')
			})
		});
		pnl.append(control);
		var pnlPos = pnl.position();
		
		var s = $S('#'+ctrlID);
		var map = options.maps[0];
		var mapStartPos = {x:0, y:0};
		var mapPos = {x:0, y:0};
		var mapImage = s.image(map.image, 0, 0)
			.drag(function(dx, dy, x, y){
				// console.log('move %s, %s', x, y);
				mapPos.x = x - mapStartPos.x;
				mapPos.y = y - mapStartPos.y;
				mapImage.attr(mapPos);
			}, function(x, y){
				//console.log('start %s, %s', x, y);
				mapStartPos = {
					x:x-mapPos.x, 
					y:y-mapPos.y
				};
				
			}, function(ev){
				console.log('map end on %o', mapPos);
			});
		;

		var pointPos = {x:0, y:0};
		var point = s.circle(size.w/2, size.h/2, 5)
			.attr({
				fill:'#f00',
				cursor:css.pointer
			})
			.drag(function(dx, dy, x, y){
				// console.log('move %s, %s', x, y);
				pointPos.x = x - pnlPos.left;
				pointPos.y = y - pnlPos.top;
				point.attr({
					cx: pointPos.x,
					cy: pointPos.y
				});
			}, function(x, y){
				// console.log('start %s, %s', x, y);
				
			}, function(ev){
				console.log('point end on %o', pointPos);
				
			});
		;
	}



	return MapControl;
})(jQuery, Clarino.version('1.1.0'), Snap);
