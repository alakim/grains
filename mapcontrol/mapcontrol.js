var MapControl = (function($, $C, $S){$H=$C.simple;
	var px = $C.css.unit.px,
		css = $C.css.keywords,
		$T = $C.css.template;

	var size = {w:300, h:300};

	$C.css.writeStylesheet({
		'.mapControlFrame':{
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

		var mapGrp = s.g();
		var mapImage = s.image(map.image, 0, 0);
		var point = s.circle(size.w/2, size.h/2, 5).attr({
			fill:'#f00',
			cursor:css.pointer
		});
		point.data("self", point);
		mapGrp.add(mapImage, point);
		mapGrp.data("self", mapGrp);
		mapGrp.drag(
			function(dx, dy, x, y, e) {//dragmove
				var self = this.data("self");
				var mtrx = this.data('trMatrix');
				var trStr = 't'+[mtrx.e+dx, mtrx.f+dy].join(',');
				self.transform(trStr);
			},
			function(x, y, e) {//dragstart
				var self = this.data("self");
				var mtrx = this.transform().globalMatrix;
				self.data('trMatrix', mtrx);
			},
			function(e) {//dragend
				var self = this.data("self");
				var mtrx = this.transform().globalMatrix;
				self.data('trMatrix', mtrx);
			}
		);
		
		point.drag(
			function(dx, dy, x, y, e) {//dragmove
				e.stopPropagation();
				var self = this.data("self");
				var pos = self.data('ptPos');
				var mtrx = mapGrp.data('trMatrix');
				if(!mtrx) mtrx = {e:0, f:0};
				self.attr({
					cx: pos.x + dx - pnlPos.left - mtrx.e,
					cy: pos.y + dy - pnlPos.top - mtrx.f
				});
			},
			function(x, y, e) {//dragstart
				e.stopPropagation();
				var self = this.data("self");
				self.data('ptPos', {x:x, y:y});
			},
			function(e) {//dragend
				e.stopPropagation();
				var self = this.data("self");
				var pos = {
					x: +self.attr('cx'),
					cy: +self.attr('cy')
				};
				console.log('point end on ', pos);
			}
		);
	}



	return MapControl;
})(jQuery, Clarino.version('1.1.0'), Snap);
