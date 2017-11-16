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

	function getPointTable(points){
		console.assert(points&&points.length, 'Missing points for map');
		var byX = [];
		points.sort(function(a,b){return a.x==b.x?0:a.x<b.x?-1:1;});
		for(var e,i=0; e=points[i],i<points.length; i++){
			byX.push(e);
		}
		var byY = [];
		points.sort(function(a,b){return a.y==b.y?0:a.y<b.y?-1:1;});
		for(var e,i=0; e=points[i],i<points.length; i++){
			byY.push(e);
		}
		return {byX: byX, byY, byY};
	}

	function getGeoPoint(pos, pointTable){

		function getInterval(order, coord, val){
			var last = order.length-1;
			if(val<order[0][coord]) return {
				min:order[0],
				max:order[1],
				extra:-1
			};
			if(val>order[last][coord]) return{
				min:order[last-1],
				max:order[last],
				extra:1
			}
			for(var i=1; i<order.length; i++){
				var mn = order[i-1],
					mx = order[i];
				if(val>=mn[coord] && val<=mx[coord]) return{
					min: mn,
					max: mx,
					extra: 0
				};
			}
		}

		function getRate(interval, horizontal){
			var coord = horizontal?{geo:'lo', screen:'x'}:{geo:'la', screen:'y'};
			return (interval.max[coord.geo] - interval.min[coord.geo]) / 
				(interval.max[coord.screen] - interval.min[coord.screen]);
		}

		var intX = getInterval(pointTable.byX, 'x', pos.x),
			intY = getInterval(pointTable.byY, 'y', pos.y),
			rate = {
				x: getRate(intX, true),
				y: getRate(intY, false)
			};

		var lo = intX.extra<=0?intX.min.lo + rate.x * (pos.x - intX.min.x)
			:intX.max.lo + rate.x * (pos.x - intX.max.x);

		var la = intY.extra<=0?intY.min.la + rate.y * (pos.y - intY.min.y)
			:intY.max.la + rate.y * (pos.y - intY.max.y);

		return {lo:lo, la:la};
	}
	
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
		var pointTable = getPointTable(map.points);

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
					y: +self.attr('cy')
				};
				
				var gPos = getGeoPoint(pos, pointTable);
				console.log('point end on ', pos, gPos);
			}
		);
	}



	return MapControl;
})(jQuery, Clarino.version('1.1.0'), Snap);
