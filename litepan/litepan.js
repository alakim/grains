var LitePan = (function($, $H, $S){
	var fixY = false;
	
	function extend(o, S){
		for(var k in S) o[k] = S[k];
	}

	var panGroup = null;
	var size = {w:100, h:100};
	var paper = null;

	var px = $H.unit('px');

	function LitePan(pnl, imgRef, imgSize, frmSize){pnl=$(pnl);
		pnl.css({width:px(frmSize.w), height: px(frmSize.h), overflow:'hidden', cursor:'move'});
		var snp = $($H.svg({width:frmSize.w, height:frmSize.h, version:'1.1', xmlns:'http://w3.org/2000/svg'}));
		size = imgSize;
		pnl.append(snp);
		paper = Snap(snp[0]);
		paper.rect(0, 0, imgSize.w, imgSize.h).attr({
			fill: '#fff',
			stroke: '#f00'
		});


		var catched = false;
		var t0 = {x:0, y:0};

		panGroup = paper.group(
			paper.image(imgRef, -imgSize.w, 0, imgSize.w, imgSize.h),
			paper.image(imgRef, 0, 0, imgSize.w, imgSize.h),
			paper.image(imgRef, imgSize.w, 0, imgSize.w, imgSize.h)
		)
		.drag(
			function(dx, dy){
				if(catched) move(dx, dy, t0);
			},
			function(){
				catched = true;
				var mtx = panGroup.attr('transform').totalMatrix;
				t0 = {x: mtx.e, y: mtx.f};
			},
			function(){
				catched = false;
				t0 = {x:0, y:0};
			}
		);
	}
	
	function move(dx, dy, t0){
		if(!panGroup) return;
		t0 = t0 || {x:0, y:0};
		var x = t0.x + dx,
			y = t0.y + dy;
		if(x<-size.w) x = x+size.w;
		else if(x>size.w) x = x-size.w;

		if(y>0) y = 0;
		else if(y<(frmSize.h - imgSize.h)) y = frmSize.h - imgSize.h;
		
		if(fixY) panGroup.transform('T'+x+',0');
		else panGroup.transform('T'+x+','+y);
	}

	function getPaper(){
		return paper;
	}

	extend(LitePan, {
		move: move,
		getPaper: getPaper
	});

	return LitePan;

})(jQuery, Html.version('4.3.0'), Snap);
