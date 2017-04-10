var LitePan = (function($, $H, $S){
	
	function extend(o, S){
		for(var k in S) o[k] = S[k];
	}

	var panGroup = null;
	var size = {w:100, h:100};

	function LitePan(pnl, imgRef, w, h){pnl=$(pnl);
		var snp = $($H.svg({width:w, height:h, version:'1.1', xmlns:'http://w3.org/2000/svg'}));
		size = {w:w, h:h};
		pnl.append(snp);
		var paper = Snap(snp[0]);
		paper.rect(0, 0, w, h).attr({
			fill: '#fff',
			stroke: '#f00'
		});


		var catched = false;

		panGroup = paper.group(
			paper.image(imgRef, -w, 0, w, h),
			paper.image(imgRef, 0, 0, w, h),
			paper.image(imgRef, w, 0, w, h)
		)
		.mousedown(function(ev){
			// console.log('down: %o', ev.movementX);
			catched = true;
			ev.stopPropagation();
		})
		.mouseup(function(ev){
			// console.log('up: %o', ev.movementX);
			catched = false;
			ev.stopPropagation();
		})
		.mousemove(function(ev){
			if(!catched) return;
			var dX = ev.movementX;
			// console.log('move: %o', dX);
			move(dX);
		});
	}
	
	function move(c){
		if(!panGroup) return;
		var t0 = panGroup.attr('transform').totalMatrix;
		var t1 = t0.e + c;
		if(t1<-size.w) t1 = t1+size.w;
		else if(t1>size.w) t1 = t1-size.w;
		panGroup.transform('T'+t1+',0');
	}

	extend(LitePan, {
		move: move
	});

	return LitePan;

})(jQuery, Html.version('4.3.0'), Snap);
