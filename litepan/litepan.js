var LitePan = (function($, $H, $S){
	var fixY = false;
	
	function extend(o, S){
		for(var k in S) o[k] = S[k];
	}

	var panGroup = null;
	var size = {img:{}, frm:{}};
	var paper = null;

	var px = $H.unit('px');

	function LitePan(pnl, imgRef, fixY, imgSize, frmSize){pnl=$(pnl);
		frmSize = frmSize || imgSize;
		pnl.css({width:px(frmSize.w), height: px(frmSize.h), overflow:'hidden', cursor:'move'});
		var snp = $($H.svg({width:frmSize.w, height:frmSize.h, version:'1.1', xmlns:'http://w3.org/2000/svg'}));
		size = {img:imgSize, frm:frmSize};
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
		if(x<-size.img.w) x = x+size.img.w;
		else if(x>size.img.w) x = x-size.img.w;

		if(y>0) y = 0;
		else if(y<(size.frm.h - size.img.h)) y = size.frm.h - size.img.h;
		
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
