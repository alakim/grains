Raphael.fn.Arrow = function(x1, y1, x2, y2, w, fill, stroke){
	
	var hyp = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	var rate = w/hyp;
	
	var p1 = {x:x1+(y2-y1)*rate, y:y1-(x2-x1)*rate};
	var p2 = {x:x1-(y2-y1)*rate, y:y1+(x2-x1)*rate};
	
	var pth = "M"+x2+" "+y2+"L"+p1.x+" "+p1.y+"L"+p2.x+" "+p2.y+"Z";
	var rP = this.path(pth);
	if(fill) rP.attr("fill", fill);
	if(stroke) rP.attr("stroke", stroke);
	
	return rP;
}

Raphael.fn.EndArrow = function(path, w, lng, fill, stroke){
	var pLng = path.getTotalLength();
	var end = path.getPointAtLength(pLng);
	var bgn = path.getPointAtLength(pLng - lng)
	return this.Arrow(bgn.x, bgn.y, end.x, end.y, w, fill, stroke);
}
