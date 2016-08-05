var TimelineEditor = (function($, $H, $R, $D){
	var size, time, ratio, timeline,
		margin = 10, objectHeight = 20, objectMargin = 3;
	var controlSize = {
		w: objectHeight - objectMargin,
		h: objectHeight - objectMargin*2
	};
	var objColor = {
		body:"#ffe",
		control:{
			lo:"#ffa",
			hi:"#f00"
		}
	};
	
	function addObject(type){
		
	}
	
	function addVect(v1, v2){
		return [v1[0]+v2[0], v1[1]+v2[1]];
	}
	
	function labelText(obj){
		return $H.format("{0} (t:{1}, d:{2})", obj.name, obj.time, obj.duration);
	}
	
	function displayObject(obj, paper){
		var pict = paper.set();
		var pos = {
			x: (obj.time - time.min)*ratio + margin,
			y: obj.y + margin
		};
		
		var body = paper.rect(
			pos.x, 
			pos.y, 
			obj.duration*ratio, 
			objectHeight
		).attr({fill:objColor.body, stroke:"#008", cursor:"move"});
		
		var label = paper.text(
			pos.x + objectMargin,
			pos.y - objectHeight/2,
			//pos.y + objectHeight/2,
			labelText(obj)
		).attr({"text-anchor":"start", cursor:"move"});
		
		var control = paper.rect(
			pos.x + obj.duration*ratio - objectHeight, 
			pos.y + objectMargin, 
			controlSize.w,
			controlSize.h
		).attr({fill:objColor.control.lo, cursor:"e-resize"});
		
		pict.push(body, control, label);
		pict.data("pSet", pict);
		pict.drag(
			function(dx, dy, x, y, e) {//dragmove
				if(this==control) return;
				var pSet = this.data("pSet");
				//console.log(this.data("mytransform"));
				//console.log(x, dx);
				
				//if(x<0 || x>size.w || y<0 || y>size.h) return;
				//if(y>size.h) return;
				
				//** var bbox = pSet.getBBox();
				//** //console.log(bbox);
				//** if((bbox.x2 + dx) > size.w) return;
				//** if((bbox.y2 + dy) > size.h) return;
				
				pSet.transform(this.data("mytransform")+'T'+dx+','+dy);
			},
			function(x, y, e) {//dragstart
				var pSet = this.data("pSet");
				pSet.data("mytransform", this.transform());
			},
			function(e) {//dragend
				var pSet = this.data("pSet");
				pSet.data("mytransform", this.transform());
				var bbox = body.getBBox();
				obj.time = Math.round(time.min + bbox.x/ratio);
				obj.y = bbox.y;
				label.attr("text", labelText(obj));
			}
		);
		
		control.drag(
			function(dx, dy, x, y, e) {//dragmove
				var pos = addVect(this.data("curPos"), [dx, dy]);
				this.attr({x:pos[0]});
				var bbox = body.getBBox();
				body.attr({width: pos[0] - body.attr("x") + controlSize.w + objectMargin});
			},
			function(x, y, e) {//dragstart
				this.data("curPos", [this.attr("x"), this.attr("y")]);
				this.attr("fill", objColor.control.hi);
			},
			function(e) {//dragend
				this.attr("fill", objColor.control.lo);
				obj.duration = Math.round(obj.time - (time.min + control.attr("x")/ratio));
				label.attr("text", labelText(obj));
			}
		);
		
		
	}
	
	function harvest(){
		return timeline.raw();
	}
	
	function init(pnl, data){pnl=$(pnl); timeline = $D(data).sort("time");
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
		addObject: addObject,
		harvest: harvest
	};
})(jQuery, Html, Raphael, JDB);