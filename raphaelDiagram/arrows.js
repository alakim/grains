Raphael.fn.Arrow = function(x1, y1, x2, y2, w, fill, stroke){
	var pth = buildArrowPath(x1, y1, x2, y2, w);
	var rP = this.path(pth);
	if(fill) rP.attr("fill", fill);
	if(stroke) rP.attr("stroke", stroke);
	
	rP.reshape = function(line){
		// console.log("reshaping ", this, line);
		console.log(line.getTotalLength());
	}
	return rP;
}

function buildArrowPath(x1, y1, x2, y2, w){
	var hyp = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	var rate = w/hyp;
	
	var p1 = {x:x1+(y2-y1)*rate, y:y1-(x2-x1)*rate};
	var p2 = {x:x1-(y2-y1)*rate, y:y1+(x2-x1)*rate};
	
	var pth = "M"+x2+" "+y2+"L"+p1.x+" "+p1.y+"L"+p2.x+" "+p2.y+"Z";
	return pth;
}

Raphael.fn.EndArrow = function(path, w, lng, fill, stroke, offset){
	function calcPoints(path){
		var pLng = path.getTotalLength();
		if(offset) pLng*=1-offset;
		var end = path.getPointAtLength(pLng);
		var bgn = path.getPointAtLength(pLng - lng);
		return {bgn:bgn, end:end};
	}
	var points = calcPoints(path);
	var pth = buildArrowPath(points.bgn.x, points.bgn.y, points.end.x, points.end.y, w);
	var arw = this.path(pth);
	if(fill) arw.attr("fill", fill);
	if(stroke) arw.attr("stroke", stroke);
	
	arw.reshape = function(line){
		var points = calcPoints(line);
		var pth = buildArrowPath(points.bgn.x, points.bgn.y, points.end.x, points.end.y, w);
		this.d = pth;
		console.log(this);
	}
	
	return arw;
}



