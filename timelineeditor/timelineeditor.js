var TimelineEditor = (function($, $H, $R, $D){
	var size = {w:800, h:400}, time, ratio, timeline,
		margin = 10, objectHeight = 20, objectMargin = 3;
	var ribbonHeight = 50;
	var controlPanelHeight = 30;
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
	
	var px = $H.unit("px");
	$H.writeStylesheet({
		".timelineEditor":{
			" .controlPanel":{
				//width: px(size.w),
				//height:px(controlPanelHeight),
				//border:"1px solid #f00"
			},
			" .framePanel":{
				margin:px(10, 0),
				//width:px(size.w),
				//height:px(size.h),
				//border:"1px solid #0f0"
			},
			" .ribbonPanel":{
				//width: px(size.w),
				//height:px(ribbonHeight),
				//border:"1px solid #00f"
			}
		}
	});
	
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
				var pos = this.data("curPos") + dx;
				this.attr({x:pos});
				
				body.attr({width: pos - body.attr("x") + controlSize.w + objectMargin});
			},
			function(x, y, e) {//dragstart
				this.data("curPos", this.attr("x"));
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
	
	function viewFrame(){
		var pnl = $(".timelineEditor .framePanel");
		pnl.css({width:size.w, height:size.h});
		var paper = $R(pnl[0], size.w, size.h);
		paper.rect(0, 0, size.w, size.h).attr({fill:"#ccc"});
		timeline.each(function(obj){
			displayObject(obj, paper);
		});
	}
	
	function viewRibbon(){
		var pnl = $(".timelineEditor .ribbonPanel");
		pnl.css({width:size.w, height:ribbonHeight});
		var paper = $R(pnl[0], size.w, ribbonHeight);
		paper.rect(0, 0, size.w, ribbonHeight).attr({fill:"#ccc"});
		var margin = 5;
		var frWidth = 80;
		var frmColor = {lo:"#ccf", hi:"#cfc"};
		var frm = paper.rect(0, margin, frWidth, ribbonHeight - margin*2).attr({fill:frmColor.lo, stroke:"#88c", cursor:"move"});
		
				
		frm.drag(
			function(dx, dy, x, y, e) {//dragmove
				var pos = this.data("curPos") + dx;
				this.attr({x:pos});
			},
			function(x, y, e) {//dragstart
				this.data("curPos", this.attr("x"));
				this.attr("fill", frmColor.hi);
			},
			function(e) {//dragend
				this.attr("fill", frmColor.lo);
			}
		);
	}
	
	function viewControls(){
		var pnl = $(".timelineEditor .controlPanel");
		pnl.css({width:size.w, height:controlPanelHeight});
		pnl.html((function(){with($H){
			return div(
				"Продолжительность: ",
				input({type:"text", "class":"tbDuration", value:time.max - time.min})
			);
		}})())
		.find(".tbDuration").change(function(){
			var v = parseInt($(this).val());
			
		}).end();
	}
	
	
	
	function init(pnl, data){pnl=$(pnl); timeline = $D(data).sort("time");
		pnl.html((function(){with($H){
			return div({"class":"timelineEditor"},
				div({"class":"controlPanel"}),
				div({"class":"framePanel"}),
				div({"class":"ribbonPanel"})
			);
		}})());

		time = (function(){
			var times = timeline.raw(),
				last = times[times.length-1];
			return {
				min: times[0].time,
				max: last.time + last.duration
				}
		})();
		ratio = (size.w - margin*2)/(time.max - time.min);
		
		viewControls();
		viewFrame();
		viewRibbon();
	}
	
	
	
	return {
		init:init,
		addObject: addObject,
		harvest: harvest
	};
})(jQuery, Html, Raphael, JDB);