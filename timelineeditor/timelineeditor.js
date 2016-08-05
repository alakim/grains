var TimelineEditor = (function($, $H, $R, $D){
	var size, time, ratio,
		margin = 10, objectHeight = 20;
	
	function addObject(type){
		
	}
	
	function displayObject(obj, paper){
		paper.rect((obj.time - time.min)*ratio + margin, obj.y + margin, obj.duration*ratio, objectHeight).attr({fill:"#ffe", stroke:"#008"});
	}
	
	function init(pnl, timeline){pnl=$(pnl); timeline = $D(timeline).sort("time");
		size = {
			w: pnl.width(),
			h: pnl.height()
		};
		time = (function(){
			var times = timeline.raw(),
				last = times[times.length-1];
			return {
				min: times[0].time,
				max: last.time + last.duration
				}
		})();
		ratio = (size.w - margin*2)/(time.max - time.min);
		
		var paper = $R(pnl[0], size.w, size.h);
		paper.rect(0, 0, size.w, size.h).attr({fill:"#ccc"});
		//paper.circle(20, 20, 10).attr({fill:"#f00"});
		timeline.each(function(obj){
			displayObject(obj, paper);
		});
	}
	
	
	
	return {
		init:init,
		addObject: addObject
	};
})(jQuery, Html, Raphael, JDB);